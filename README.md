# Project name

Restaurant Management System

# Project goals

Xây dựng một hệ thống giúp nhân viên và quản lý nhà hàng thực hiện các công việc sau một cách dễ dàng và hiệu quả:

1. Quản lý người dùng (admin, nhân viên)
2. Theo dõi trạng thái bàn (còn trống / đang sử dụng)
3. Quản lý bàn ăn
4. Quản lý món ăn, danh mục món
5. Nhận và xử lý đơn hàng
6. Thanh toán

# Technology used

- NodeJS(ExpressJS), MongoDB, JWT, mô hình MVC.

# Middleware

- Kiểm tra người dùng đã đăng nhập hay chưa (có token hợp lệ hay không), Kiểm tra người dùng có vai trò là ADMIN hay không thì được CRUD

1. Lấy token từ header Authorization.
2. Giải mã token bằng JWT_SECRET.
3. Kiểm tra token hết hạn chưa.
4. Tìm người dùng trong DB qua userId trong token.
5. Nếu hợp lệ: gán req.user = user và gọi next().
6. Nếu không: trả về lỗi 401 với thông báo cụ thể.

# API

1. Quản lý người dùng

- Chức năng chính CRUD.

- API login => access_token và refreshToken (không có trả ra password)
  http://localhost:8080/api/v1/users/login
- API create người dùng: (name, password, email, phone, dateOfBirth, role, status, confirmPassword), check email nếu email có rồi sẽ không được create
  http://localhost:8080/api/v1/users/register
- API trả ra data tất cả user (không trả ra password)
  http://localhost:8080/api/v1/users/
- API get tài khoản login.
  http://localhost:8080/api/v1/users/me
- API trả ra user theo id.
  http://localhost:8080/api/v1/users/:id
- API update user theo id, không cho update email.
  http://localhost:8080/api/v1/users/:id
- API delete user theo id.
  http://localhost:8080//api/v1/users/:id

2. Category

- Chức năng chính CRUD.

- API create category: (name, description, isActive), kiểm tra isAuthenticated mới được create
  http://localhost:8080/api/v1/categories/
- API trả ra data tất cả category.
  http://localhost:8080/api/v1/categories/
- API trả ra category theo id.
  http://localhost:8080/api/v1/categories
- API update category theo id.
  http://localhost:8080/api/v1/categories/:id
- API delete category theo id.
  http://localhost:8080/api/v1/categories/:id

3. Menu

- Các món ăn phải theo từng category (VD: nước ngọt phải trong danh mục nước), ảnh được load từ cloudinary. Chức năng chính CRUD.

- API create menu: (name, price, description, category, image_url), kiểm tra isAuthenticated mới được create
  http://localhost:8080/api/v1/menus/
- API trả ra data tất cả menu.
  http://localhost:8080/api/v1/menus/
- API trả ra menu theo id.
  http://localhost:8080/api/v1/menus
- API update menu theo id.
  http://localhost:8080/api/v1/menus/:id
- API delete menu theo id.
  http://localhost:8080/api/v1/menus/:id

4. Table

- Status mặc định là AVAILABLE, vị trí mặc định INSIDE, chức năng chính CRUD.

- API create table: (tableNumber, capacity, status, location), kiểm tra isAuthenticated mới được create
  http://localhost:8080/api/v1/tables/
- API trả ra data tất cả table.
  http://localhost:8080/api/v1/tables/
- API trả ra table theo id.
  http://localhost:8080/api/v1/tables
- API update table theo id.
  http://localhost:8080/api/v1/tables/:id
- API delete table theo id.
  http://localhost:8080/api/v1/tables/:id

5. Order

- Liên kết với bảng User và Table, nếu khách mua mang về thì không cần thêm trường table và ngược lại khách ngồi lại ăn thì có thêm trường table. Status mặc định là pending. Chức năng chính CRUD.

- API create order: (customer, table, orderType), kiểm tra isAuthenticated mới được create
  http://localhost:8080/api/v1/orders/
- API trả ra data tất cả order.
  http://localhost:8080/api/v1/orders/
- API trả ra order theo id.
  http://localhost:8080/api/v1/orders
- API update order theo id.
  http://localhost:8080/api/v1/orders/:id
- API delete order theo id.
  http://localhost:8080/api/v1/orders/:id

# Data trả ra định dạng là JSON.

# Môi trường chạy dự án: Node.js v20.14.0

https://nodejs.org/download/release/v20.14.0/

Các bước cài đặt: (chế độ development)

1. clone code
2. cài đặt thư viện: npm i
3. Update file .env.development (nếu cần thiết)
4. Chạy dự án: npm run dev

===

Cách chạy tại chế độ production:

1. clone code
2. cài đặt thư viện: npm i
3. Update file .env.production (nếu cần thiết)
4. Build dự án: npm run build
5. Chạy dự án: npm run preview
