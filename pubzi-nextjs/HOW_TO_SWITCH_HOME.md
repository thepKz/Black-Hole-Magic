# Cách Chuyển Đổi Giữa Home-2 và Home-7

## Hướng dẫn nhanh

1. Mở file `src/config/home.ts`
2. Thay đổi giá trị `HOME_VERSION`:
   - `'home-2'` → Hiển thị trang Esports
   - `'home-7'` → Hiển thị trang Gaming Studio

## Ví dụ

### Để dùng Home-7 (Gaming Studio):
```typescript
export const HOME_VERSION: HomeVersion = 'home-7';
```

### Để dùng Home-2 (Esports):
```typescript
export const HOME_VERSION: HomeVersion = 'home-2';
```

## Sau khi thay đổi

1. Save file
2. Trang web sẽ tự động reload
3. Trang chủ sẽ hiển thị theo phiên bản bạn chọn

## Lưu ý

- Không cần restart server
- Thay đổi áp dụng cho trang chủ `/` (localhost:3000/)
- Vẫn có thể truy cập trực tiếp:
  - `/home-7` → Luôn hiển thị Home-7
  - Các trang khác (about, contact, etc.) không bị ảnh hưởng
