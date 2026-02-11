Since you're building modern projects (React, Prisma, MongoDB, AI integration), I'll show you the **correct production way** to use Cloudinary in **Next.js (App Router)**.

We’ll cover:

1. Upload Image
2. Store URL
3. Delete Image
4. Secure setup

---

# 🚀 Cloudinary Integration in Next.js (App Router)

---

## 1️⃣ Install Packages

```bash
npm install cloudinary multer next-connect dotenv
```

⚠️ If using App Router (recommended), you don’t need `multer`.

---

## 2️⃣ Setup `.env.local`

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Restart server after adding env.

---

## 3️⃣ Create Cloudinary Config

📁 `lib/cloudinary.js`

```js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

---

# ✅ Method 1 (Recommended): Upload via API Route (Server Side)

## 4️⃣ Create API Route

📁 `app/api/upload/route.js`

```js
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "nextjs_uploads" }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    return Response.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

---

## 5️⃣ Frontend Upload Component

```jsx
"use client";
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

---

# 🔥 Method 2 (Direct Upload from Frontend - Faster CDN)

This avoids server load.

Use unsigned upload preset in Cloudinary dashboard.

```js
const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", "your_unsigned_preset");

await fetch(
  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  {
    method: "POST",
    body: formData,
  }
);
```

⚠️ Only use unsigned preset for public uploads.

---

# 🧠 If Using Prisma + MongoDB

Your Prisma model:

```prisma
model Blog {
  id        String @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  imageUrl  String
  publicId  String
  createdAt DateTime @default(now())
}
```

Store:

```js
imageUrl: uploadResponse.secure_url,
publicId: uploadResponse.public_id
```

---

# 🗑 Delete Image API

📁 `app/api/delete/route.js`

```js
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  const { public_id } = await req.json();

  await cloudinary.uploader.destroy(public_id);

  return Response.json({ message: "Deleted successfully" });
}
```

---

# 💎 Production Best Practices

✔ Use signed uploads for authenticated users
✔ Limit file size
✔ Validate file type
✔ Use transformation URLs

Example transformation:

```
https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/sample.jpg
```

---

# 🎯 For Your Portfolio + Markdown Blog

Since you wanted:

* Cloudinary image visualization
* Markdown blogs with visual modes
* Prisma + MongoDB

This setup is perfect for:

* Blog cover image upload
* User profile image
* 3D model preview image storage
* AI-generated image storage

---