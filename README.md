# LaboratoryManagement (Frontend)

Ứng dụng Frontend cho hệ thống quản lý phòng thí nghiệm. Repository này chỉ chứa phần frontend; backend được triển khai trong một repository riêng sử dụng Java Spring Boot theo kiến trúc microservices.

## Tổng quan

Repository này chứa mã nguồn giao diện người dùng (frontend) cho LaboratoryManagement. Frontend giao tiếp với các microservices backend (Java Spring Boot) qua API (thường là một API Gateway hoặc các endpoint của các service).

## Backend

Backend không có trong repository này. Backend là một hệ thống microservices viết bằng Java Spring Boot và được lưu trữ ở repository riêng.  
Nếu có, hãy thêm liên kết tới repository backend (ví dụ: https://github.com/your-org/laboratory-backend) để người dùng biết nơi chứa backend.

## Công nghệ (Tech Stack)

- Frontend: React 
- Backend: Java Spring Boot (microservices) — repository riêng  
- Quản lý gói: npm / yarn (tùy theo frontend)

> Ghi chú: Mình chưa kiểm tra cấu trúc file trong repo — sẽ cập nhật chính xác stack và lệnh cài đặt sau khi xem package.json hoặc tệp cấu hình tương tự.

## Biến môi trường quan trọng

Frontend cần biết URL của backend (API). Ví dụ:
- REACT_APP_API_BASE_URL (React) — trỏ tới API Gateway hoặc endpoint của backend


## Cài đặt và chạy (Local)

1. Clone repository:

```bash
git clone https://github.com/phandinhthai012/LaboratoryManagement.git
cd LaboratoryManagement
```

2. Cài đặt phụ thuộc:

```bash
# nếu dùng npm
npm install

# nếu dùng yarn
yarn install
```

3. Thiết lập biến môi trường:

Tạo file `.env` hoặc `.env.local` với biến REACT_APP_API_BASE_URL (hoặc tên tương ứng) trỏ tới backend.

4. Chạy frontend:

```bash
# phát triển
npm start
# hoặc
npm run dev
```

## Cấu trúc đề xuất của repo

- /src - mã nguồn frontend  
- /public - tài nguyên tĩnh  
- /docs - tài liệu (tùy chọn)  

(Điều chỉnh theo cấu trúc thực tế của repo.)

## Đóng góp (Contributing)

Rất hoan nghênh PR và issue. Vì backend nằm ở repo khác, khi gửi PR/issue liên quan tới API, vui lòng chỉ rõ:
- URL API mà frontend mong đợi
- Phiên bản contract (OpenAPI/Swagger) nếu có

## License

Thêm file LICENSE nếu cần (ví dụ MIT). Nếu bạn muốn, mình có thể tạo file LICENSE phù hợp.

## Liên hệ

Nếu muốn mình sẽ:
- Cập nhật README để nêu chính xác framework frontend sau khi kiểm tra repo,  
- Thêm liên kết đến repository backend nếu bạn cung cấp URL,  
- Tạo `.env.example` và/hoặc file `LICENSE` nếu bạn muốn.