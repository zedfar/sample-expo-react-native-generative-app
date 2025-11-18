import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSurveyStore } from '@/store/surveyStore';
import { Card } from '@/components/common/Card';
import { FileText, MapPin, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const { surveys, isLoading, loadSurveys } = useSurveyStore();

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleRefresh = () => {
    loadSurveys();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#10B981';
      case 'verified':
        return '#3B82F6';
      case 'draft':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Terkirim';
      case 'verified':
        return 'Terverifikasi';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          Riwayat Survey
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          {surveys.length} survey tersimpan
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.content}>
          {surveys.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={64} color={isDark ? '#4B5563' : '#9CA3AF'} />
              <Text style={[styles.emptyTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Belum ada survey
              </Text>
              <Text style={[styles.emptyText, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                Survey yang Anda buat akan muncul di sini
              </Text>
            </View>
          ) : (
            surveys.map((survey) => (
              <TouchableOpacity key={survey.id} activeOpacity={0.7}>
                <Card className="mb-4">
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text
                        style={[
                          styles.farmerName,
                          { color: isDark ? '#FFFFFF' : '#111827' },
                        ]}
                      >
                        {survey.farmerName}
                      </Text>
                      {survey.farmerPhone && (
                        <Text
                          style={[
                            styles.farmerPhone,
                            { color: isDark ? '#9CA3AF' : '#6B7280' },
                          ]}
                        >
                          {survey.farmerPhone}
                        </Text>
                      )}
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(survey.status)}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(survey.status) },
                        ]}
                      >
                        {getStatusText(survey.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <MapPin
                      size={16}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                      style={styles.icon}
                    />
                    <Text style={[styles.infoText, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                      {survey.field.name} • {survey.field.area} ha
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <FileText
                      size={16}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                      style={styles.icon}
                    />
                    <Text style={[styles.infoText, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                      {survey.crops[0]?.name} • {survey.crops[0]?.variety}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Calendar
                      size={16}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                      style={styles.icon}
                    />
                    <Text style={[styles.infoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {formatDate(survey.createdAt)}
                    </Text>
                  </View>

                  {survey.notes && (
                    <Text
                      style={[
                        styles.notes,
                        { color: isDark ? '#9CA3AF' : '#6B7280' },
                      ]}
                      numberOfLines={2}
                    >
                      {survey.notes}
                    </Text>
                  )}
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  farmerPhone: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  notes: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
