# Trung Anh — Chrome Extension Hub

Trang cổng thông tin tĩnh giới thiệu, tra cứu nhanh (`⌘K`) và cung cấp liên kết cài đặt chính thức cho 3 Chrome Extension của Trung Anh: **Điều dưỡng VNPT HIS**, **HIS CamSync** và **Aladinn**.

Giao diện được xây dựng trên hệ thống phần tử tương tác **Lucian UX/UI** và hợp đồng thiết kế [`DESIGN.md`](./DESIGN.md) (tông màu khoáng thạch trung tính kết hợp xanh biển sắc nét, chuyển đổi Sáng/Tối mượt mà, tối ưu cho cả máy trạm khoa phòng lẫn thiết bị di động).

## Danh sách Tiện ích

1. **Điều dưỡng VNPT HIS**: Hỗ trợ nghiệp vụ điều dưỡng, phiếu chăm sóc và theo dõi người bệnh trên hệ thống VNPT HIS.
2. **HIS CamSync**: Đồng bộ tức thì ảnh chụp ECG giấy, kết quả siêu âm và nội soi từ điện thoại vào VNPT HIS qua kết nối ngang hàng WebRTC P2P.
3. **Aladinn**: Tiện ích cá nhân tối ưu hóa trải nghiệm duyệt Chrome với phím tắt nhanh và thao tác gọn nhẹ.

## Tính năng Giao diện Nổi bật

- **Bảng lệnh nhanh (`⌘K` / `Ctrl+K`)**: Hỗ trợ tìm kiếm tiếng Việt có dấu hoặc không dấu để mở nhanh trang cài đặt hoặc sao chép liên kết.
- **Lọc danh mục & Chia sẻ một chạm**: Chuyển đổi mượt giữa nhóm tiện ích Y tế và Cá nhân; sao chép liên kết cài đặt trong một chạm để gửi nhanh qua Zalo hoặc tin nhắn nội bộ cho đồng nghiệp mở trên máy tính.
- **Chuyển đổi Sáng / Tối đồng bộ**: Tự động nhận diện chế độ hệ thống hoặc chuyển đổi trực tiếp ngay trên thanh đầu trang.

---

## Cách chạy thử tại máy cục bộ (Local)

### Cách 1: Mở trực tiếp
Mở file `index.html` trên trình duyệt Chrome, Edge hoặc Safari.

### Cách 2: Sử dụng máy chủ cục bộ (Khuyên dùng)
```bash
npx serve .
```

---

## Triển khai lên Vercel (Free)

Dự án là trang tĩnh thuần HTML/CSS/JS (không cần bước build phức tạp):
```bash
npx vercel --prod
```

---

## An toàn & Bảo mật

Dự án tuân thủ nghiêm ngặt **Quy Tắc An Toàn VNPT HIS (`vnpt-his-safety`)** và **Luật Bảo vệ dữ liệu cá nhân Việt Nam 2025**:
- Không thu thập, không truyền tải và không lưu trữ bất kỳ dữ liệu bệnh nhân hay thông tin sức khỏe cá nhân (PHI) nào.
- Chỉ dẫn hướng tới các liên kết công khai chính thức trên cửa hàng Chrome Web Store của Google.
