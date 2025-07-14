# 🍽️ API - Restaurant Management

Dự án xây dựng hệ thống quản lý nhà hàng, cho phép người dùng đặt bàn, đặt món, quản lý đơn hàng và phân quyền theo vai trò (admin, nhân viên, khách hàng).

## 🚀 Stack sử dụng

- **Node.js** + **ExpressJS**
- **MongoDB** với **Mongoose**
- **JWT** cho xác thực
- **Kiến trúc thư mục**: mô hình phân chia `controller`, `service`, `route`, `model`
- **Môi trường**: cấu hình bằng `.env`

---

## 📁 Cấu trúc thư mục

api-restaurant/
│
├── controllers/ # Xử lý request và gọi services
├── services/ # Xử lý logic chính
├── models/ # Định nghĩa schema MongoDB
├── routes/ # Khai báo các API endpoint
├── config/ # Kết nối MongoDB, biến môi trường
├── middlewares/ # Xử lý lỗi, xác thực, phân quyền
├── utils/ # Hàm tiện ích (nếu có)
├── .env # Biến môi trường
└── server.js # Start server

---

## ✅ Các tính năng chính

- [x] Đăng ký / đăng nhập người dùng
- [x] Phân quyền (admin / staff / user)
- [x] CRUD món ăn
- [x] CRUD bàn ăn (số bàn, trạng thái)
- [x] Tạo và xử lý đơn hàng
- [x] Xử lý lỗi và thông báo rõ ràng
- [x] Mã hóa mật khẩu bằng bcrypt
- [x] Dữ liệu lưu trữ bằng MongoDB

---

## 🛠️ Cài đặt

```bash

git clone https://github.com/phamquoccuong20/api-restaurant.git
npm install

PORT=8080
MONGO_URI=mongodb://localhost:27017/restaurant
JWT_SECRET=your_secret_key

npm run dev

## Một số API endpoint.

| Method    | Endpoint                             | Mô tả                        |
| ------    | ------------------                   | ---------------------------- |
| POST      | /api/v1/users/auth/register          | Đăng ký người dùng           |
| POST      | /api/v1/users/auth/login             | Đăng nhập và nhận token      |
| GET       | /api/v1/table/all/:limt&page         | Lấy danh sách bàn ăn         |
| POST      | /api/v1/menus/create                 | Tạo món ăn mới               |
| DELETE    | /api/users/admin/delete/:id          | Lấy danh sách đơn hàng       |
| PUT       | /api/v1/orders/update/:id            | Cập nhật trạng thái đơn hàng |
