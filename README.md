# Trung Anh - Chrome Extension Hub

Trang Landing Page tĩnh giới thiệu và cung cấp liên kết cài đặt nhanh cho 2 Chrome Extension cá nhân của Trung Anh: **Điều dưỡng VNPT HIS** và **Aladinn**.

Trang web được thiết kế theo phong cách Glassmorphism hiện đại, hỗ trợ tự động chuyển đổi giao diện Sáng/Tối (Light/Dark mode) và tối ưu hóa trải nghiệm trên mọi thiết bị.

## Danh sách Tiện ích

1. **Điều dưỡng VNPT HIS**: Hỗ trợ nghiệp vụ điều dưỡng và tương tác y tế trên VNPT HIS.
2. **Aladinn**: Tiện ích cá nhân tối ưu hóa trải nghiệm duyệt web.

---

## Cách chạy thử tại máy cục bộ (Local)

Bạn có thể chạy thử trực tiếp trang web bằng một trong các cách sau:

### Cách 1: Mở trực tiếp
Kích đúp vào file `index.html` để mở trực tiếp trên trình duyệt.

### Cách 2: Sử dụng máy chủ cục bộ (Khuyên dùng)
Nếu máy bạn có cài đặt NodeJS, hãy chạy lệnh sau tại thư mục này để khởi chạy một server mini:
```bash
npx serve .
```
Hoặc:
```bash
npx -y live-server
```

---

## Hướng dẫn triển khai lên Vercel (Free)

Bạn có thể đưa trang web này lên Vercel hoàn toàn miễn phí chỉ trong vài bước:

### Cách 1: Sử dụng Vercel CLI (Nhanh nhất từ Terminal)

1. Mở Terminal tại thư mục này.
2. Chạy lệnh:
   ```bash
   npx vercel
   ```
3. Đăng nhập tài khoản Vercel của bạn (nếu được hỏi).
4. Đồng ý với các tùy chọn mặc định bằng cách ấn `Enter` liên tục.
5. Sau khi thành công, Vercel sẽ cung cấp link truy cập trực tiếp (ví dụ: `extension-hub-xxx.vercel.app`).
6. Để đẩy lên production chính thức, chạy tiếp:
   ```bash
   npx vercel --prod
   ```

### Cách 2: Kết nối kho lưu trữ GitHub (Khuyên dùng lâu dài)

1. Tạo một repository mới trên GitHub (ví dụ: `my-chrome-extensions`).
2. Khởi tạo Git tại thư mục này và push code lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <URL_REPO_CỦA_BẠN>
   git push -u origin main
   ```
3. Truy cập [Vercel Dashboard](https://vercel.com/dashboard) -> Chọn **Add New Project**.
4. Import repository GitHub vừa push lên.
5. Chọn Framework là **Other** (Vercel tự động nhận diện trang tĩnh HTML/CSS).
6. Nhấp **Deploy** và chờ 30 giây để hoàn tất. Mỗi khi bạn push cập nhật mới lên GitHub, Vercel sẽ tự động deploy lại phiên bản mới nhất!

---

## An toàn & Bảo mật
Dự án tuân thủ nghiêm ngặt **Quy Tắc An Toàn VNPT HIS (vnpt-his-safety)** và **Luật An toàn dữ liệu cá nhân Việt Nam 2025**:
- Không thu thập, không truyền tải và không ghi nhận bất kỳ dữ liệu bệnh nhân hay thông tin sức khỏe cá nhân (PHI) nào.
- Chỉ lưu trữ các liên kết công khai trỏ đến cửa hàng ứng dụng Chrome Web Store chính thức của Google.
