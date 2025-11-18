# PLAN.md

## 📌 Instruction (Wajib Dibaca Sebelum Membuat Project)

Untuk setiap pembuatan **project React Native baru**, SELALU gunakan boilerplate berikut agar project konsisten, siap untuk pengembangan generative AI, dan memiliki struktur multi-project yang rapi.

### 🔧 Perintah Standar Pembuatan Project
Gunakan template **agent-generator** bawaan ERN Boilerplate:

```
npx --yes create-ern-boilerplate {project-name} -y --desc "{project deskripsi}" --template agent-generator
```

### 📝 Contoh Pembuatan Project TodoList
```
npx --yes create-ern-boilerplate todolist-app -y --desc "project todolist" --template agent-generator
```

### 🗂️ Catatan Penting: Multi-Project Workspace
- repo ini mendukung **multi-project**.
- **SELALU buat folder baru** untuk setiap project.
- Hindari mencampur beberapa project dalam satu root folder.
- Jika butuh workspace, gunakan struktur:

```
/projects
  ├── todolist-app/
  ├── finance-app/
  ├── notes-app/
  └── ...
```

---