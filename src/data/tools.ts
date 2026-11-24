export interface Tool {
  id: string;
  slug: string;
  category: ToolCategory;
  title: string;
  shortDesc: string;
  badge: string;
  icon: string;
  primary?: boolean;
}

export type ToolCategory =
  | 'screen'
  | 'keyboard'
  | 'mouse'
  | 'audio'
  | 'camera'
  | 'device'
  | 'browser'
  | 'utilities';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'screen', name: 'Màn hình', icon: 'Monitor', description: 'Kiểm tra tần số quét, điểm chết, hở sáng, độ phân giải' },
  { id: 'keyboard', name: 'Bàn phím', icon: 'Keyboard', description: 'Kiểm tra nhận diện phím, dính phím chatter, rollover, numpad' },
  { id: 'mouse', name: 'Chuột', icon: 'Mouse', description: 'Kiểm tra nút bấm, double click, CPS, polling rate' },
  { id: 'audio', name: 'Âm thanh', icon: 'Volume2', description: 'Kiểm tra microphone, loa, stereo, phát tần số' },
  { id: 'camera', name: 'Camera', icon: 'Camera', description: 'Xem trước webcam, độ phân giải, tốc độ khung hình FPS' },
  { id: 'device', name: 'Thiết bị', icon: 'Cpu', description: 'Xem cấu hình phần cứng, card đồ họa GPU, cảm ứng' },
  { id: 'browser', name: 'Trình duyệt', icon: 'Globe', description: 'Kiểm tra tương thích Web API, dung lượng lưu trữ, toàn màn hình' },
  { id: 'utilities', name: 'Tiện ích', icon: 'Wrench', description: 'Số thành chữ, tính %, mật khẩu, mã màu, JSON, đếm từ, đổi đơn vị' },
];

export const TOOLS: Tool[] = [
  // --- MÀN HÌNH (11) ---
  {
    id: 'screen-refresh-rate',
    slug: 'refresh-rate',
    category: 'screen',
    title: 'Ước tính Refresh Rate',
    shortDesc: 'Đo tần số quét (Hz) màn hình thực tế qua khung hình render.',
    badge: 'Hz',
    icon: 'Activity',
    primary: true
  },
  {
    id: 'screen-ghosting',
    slug: 'ghosting',
    category: 'screen',
    title: 'Ghosting & Motion Blur',
    shortDesc: 'Quan sát vệt bóng mờ khi vật thể chuyển động tốc độ cao (Test UFO).',
    badge: 'UFO',
    icon: 'FastForward',
    primary: true
  },
  {
    id: 'screen-resolution',
    slug: 'resolution',
    category: 'screen',
    title: 'Độ phân giải màn hình',
    shortDesc: 'Kích thước điểm ảnh thực tế và tỷ lệ thu phóng của hệ điều hành.',
    badge: 'W × H',
    icon: 'Maximize'
  },
  {
    id: 'screen-viewport',
    slug: 'viewport',
    category: 'screen',
    title: 'Viewport & DPR',
    shortDesc: 'Xem kích thước khung nhìn trình duyệt (CSS px) và tỉ lệ Device Pixel Ratio.',
    badge: 'CSS px',
    icon: 'Layout'
  },
  {
    id: 'screen-aspect-ratio',
    slug: 'aspect-ratio',
    category: 'screen',
    title: 'Tính tỷ lệ khung hình',
    shortDesc: 'Tính tỷ lệ chuẩn (16:9, 16:10, 21:9...) từ chiều rộng và chiều cao.',
    badge: '16 : 9',
    icon: 'Proportions'
  },
  {
    id: 'screen-ppi',
    slug: 'ppi',
    category: 'screen',
    title: 'Tính mật độ điểm ảnh PPI',
    shortDesc: 'Tính Pixels Per Inch dựa trên độ phân giải và kích thước inch.',
    badge: 'PPI',
    icon: 'Grid'
  },
  {
    id: 'screen-dead-pixel',
    slug: 'dead-pixel',
    category: 'screen',
    title: 'Kiểm tra điểm ảnh chết',
    shortDesc: 'Chuyển đổi toàn màn hình các màu đơn sắc để phát hiện điểm ảnh chết (đen/tối).',
    badge: '●',
    icon: 'Eye',
    primary: true
  },
  {
    id: 'screen-stuck-pixel',
    slug: 'stuck-pixel',
    category: 'screen',
    title: 'Kiểm tra điểm ảnh kẹt',
    shortDesc: 'Phát hiện điểm ảnh bị kẹt màu (RGB) và công cụ nhấp nháy tần số cao để sửa.',
    badge: 'R · G · B',
    icon: 'Sparkles'
  },
  {
    id: 'screen-backlight-bleed',
    slug: 'backlight-bleed',
    category: 'screen',
    title: 'Kiểm tra hở sáng',
    shortDesc: 'Sử dụng nền đen tuyệt đối trong phòng tối để kiểm tra hiện tượng hở sáng IPS/LCD.',
    badge: '◩',
    icon: 'Sun'
  },
  {
    id: 'screen-color-gradient',
    slug: 'color-gradient',
    category: 'screen',
    title: 'Màu sắc & Gradient',
    shortDesc: 'Xem dải chuyển màu mượt mà để đánh giá độ sâu màu 8-bit, 10-bit.',
    badge: 'RGB',
    icon: 'Palette'
  },
  {
    id: 'screen-touch',
    slug: 'touch',
    category: 'screen',
    title: 'Kiểm tra cảm ứng đa điểm',
    shortDesc: 'Thử nghiệm nhận diện nhiều ngón tay cùng lúc trên màn hình cảm ứng.',
    badge: '＋ ＋',
    icon: 'Touchpad'
  },

  // --- BÀN PHÍM (5) ---
  {
    id: 'keyboard-tester',
    slug: 'tester',
    category: 'keyboard',
    title: 'Kiểm tra bàn phím (Có Numpad)',
    shortDesc: 'Giao diện bàn phím trực quan đầy đủ, nhận diện phím chữ, phím điều hướng và phím số.',
    badge: 'A · S · D',
    icon: 'Keyboard',
    primary: true
  },
  {
    id: 'keyboard-chatter',
    slug: 'chatter',
    category: 'keyboard',
    title: 'Key Chatter (Lặp phím)',
    shortDesc: 'Đo khoảng cách giữa 2 lần nhấn liên tiếp để phát hiện switch bị lỗi double click/chatter.',
    badge: 'D · D',
    icon: 'AlertTriangle',
    primary: true
  },
  {
    id: 'keyboard-rollover',
    slug: 'rollover',
    category: 'keyboard',
    title: 'Key Rollover (NKRO)',
    shortDesc: 'Thử giữ đồng thời nhiều phím xem bàn phím nhận diện tối đa bao nhiêu phím cùng lúc.',
    badge: 'W + A + D',
    icon: 'Layers'
  },
  {
    id: 'keyboard-hold',
    slug: 'hold',
    category: 'keyboard',
    title: 'Thời gian giữ phím',
    shortDesc: 'Đo chính xác mili-giây từ thời điểm nhấn phím xuống đến khi thả phím ra.',
    badge: '↓ ⋯ ↑',
    icon: 'Clock'
  },
  {
    id: 'keyboard-events',
    slug: 'events',
    category: 'keyboard',
    title: 'Keyboard Event Inspector',
    shortDesc: 'Bảng theo dõi chuyên sâu: key, code, keyCode, location, trạng thái phím bổ trợ.',
    badge: 'KeyD',
    icon: 'Terminal'
  },

  // --- CHUỘT (7) ---
  {
    id: 'mouse-buttons',
    slug: 'buttons',
    category: 'mouse',
    title: 'Kiểm tra nút chuột',
    shortDesc: 'Kiểm tra nhận diện chuột trái, chuột phải, con lăn giữa và 2 nút hông (Back/Forward).',
    badge: 'L · M · R',
    icon: 'Mouse',
    primary: true
  },
  {
    id: 'mouse-double-click',
    slug: 'double-click',
    category: 'mouse',
    title: 'Kiểm tra lỗi Double Click',
    shortDesc: 'Đo thời gian phản hồi giữa các lần click, cảnh báo nếu switch bị double click ngoài ý muốn.',
    badge: '● ●',
    icon: 'MousePointerClick',
    primary: true
  },
  {
    id: 'mouse-cps',
    slug: 'cps',
    category: 'mouse',
    title: 'Tốc độ nhấp CPS',
    shortDesc: 'Đo số lần nhấp chuột mỗi giây (Clicks Per Second) theo thời gian 1s, 5s, 10s.',
    badge: 'CPS',
    icon: 'Zap'
  },
  {
    id: 'mouse-scroll',
    slug: 'scroll',
    category: 'mouse',
    title: 'Kiểm tra con lăn',
    shortDesc: 'Thử hướng cuộn lên/xuống, bước cuộn deltaY và độ mượt của con lăn chuột.',
    badge: '↑ ↓',
    icon: 'ArrowUpDown'
  },
  {
    id: 'mouse-polling-rate',
    slug: 'polling-rate',
    category: 'mouse',
    title: 'Ước tính Polling Rate',
    shortDesc: 'Đo tần suất gửi tín hiệu (Hz: 125Hz, 500Hz, 1000Hz, 4000Hz+) khi di chuột.',
    badge: 'Hz',
    icon: 'Gauge'
  },
  {
    id: 'mouse-movement',
    slug: 'movement',
    category: 'mouse',
    title: 'Chuyển động chuột',
    shortDesc: 'Vẽ và theo dõi đường đi của con trỏ để kiểm tra cảm biến quang học có bị giật hay rơi mắt đọc.',
    badge: 'x · y',
    icon: 'Milestone'
  },
  {
    id: 'mouse-accuracy',
    slug: 'accuracy',
    category: 'mouse',
    title: 'Độ chính xác chuột',
    shortDesc: 'Trò chơi ngắm bắn mục tiêu (Aim Trainer) rèn luyện và đo độ chuẩn xác của chuột.',
    badge: '⊙',
    icon: 'Target'
  },

  // --- ÂM THANH (5) ---
  {
    id: 'audio-microphone',
    slug: 'microphone',
    category: 'audio',
    title: 'Kiểm tra microphone',
    shortDesc: 'Xem mức âm lượng thu thực tế, đo tín hiệu dB từ micro máy tính hoặc tai nghe.',
    badge: 'Mic dB',
    icon: 'Mic',
    primary: true
  },
  {
    id: 'audio-spectrum',
    slug: 'spectrum',
    category: 'audio',
    title: 'Phổ âm thanh',
    shortDesc: 'Trực quan hóa dải tần số âm thanh từ microphone qua biểu đồ FFT thời gian thực.',
    badge: 'FFT',
    icon: 'BarChart2',
    primary: true
  },
  {
    id: 'audio-speaker',
    slug: 'speaker',
    category: 'audio',
    title: 'Kiểm tra loa & tai nghe',
    shortDesc: 'Phát các đoạn âm thanh mẫu đa dải tần để kiểm tra chất lượng loa ngoài hoặc tai nghe.',
    badge: '♪',
    icon: 'Volume2'
  },
  {
    id: 'audio-stereo',
    slug: 'stereo',
    category: 'audio',
    title: 'Kiểm tra kênh Stereo',
    shortDesc: 'Phát âm thanh riêng biệt cho kênh Trái (Left) và kênh Phải (Right) để test tai nghe.',
    badge: 'L · R',
    icon: 'Headphones'
  },
  {
    id: 'audio-frequency-generator',
    slug: 'frequency-generator',
    category: 'audio',
    title: 'Tạo tần số âm thanh',
    shortDesc: 'Máy phát sóng âm chuẩn (Sine, Square, Sawtooth) từ 20 Hz đến 20,000 Hz.',
    badge: 'Hz',
    icon: 'Radio'
  },

  // --- CAMERA (3) ---
  {
    id: 'camera-preview',
    slug: 'preview',
    category: 'camera',
    title: 'Xem trước webcam',
    shortDesc: 'Hiển thị video trực tiếp từ webcam máy tính, hỗ trợ lật gương và chụp ảnh nhanh.',
    badge: 'Live',
    icon: 'Camera',
    primary: true
  },
  {
    id: 'camera-resolution',
    slug: 'resolution',
    category: 'camera',
    title: 'Độ phân giải camera',
    shortDesc: 'Quét và phát hiện các độ phân giải hỗ trợ tối đa (720p, 1080p, 4K...) của webcam.',
    badge: 'W × H',
    icon: 'Scan'
  },
  {
    id: 'camera-fps',
    slug: 'fps',
    category: 'camera',
    title: 'FPS camera',
    shortDesc: 'Đo tốc độ khung hình thực tế của webcam theo thời gian thực.',
    badge: 'FPS',
    icon: 'Film'
  },

  // --- THIẾT BỊ (3) ---
  {
    id: 'device-information',
    slug: 'information',
    category: 'device',
    title: 'Thông tin thiết bị & OS',
    shortDesc: 'Xem hệ điều hành, số nhân CPU, RAM, tần số quét màn hình, mạng di động và độ trễ ping.',
    badge: 'OS · CPU',
    icon: 'Laptop',
    primary: true
  },
  {
    id: 'device-gpu',
    slug: 'gpu',
    category: 'device',
    title: 'Thông tin GPU / WebGL',
    shortDesc: 'Trích xuất tên card đồ họa (NVIDIA, AMD, Intel, Apple), nhà sản xuất và hỗ trợ WebGL.',
    badge: 'WebGL',
    icon: 'Cpu'
  },
  {
    id: 'device-pointer-capabilities',
    slug: 'pointer-capabilities',
    category: 'device',
    title: 'Khả năng cảm ứng & Con trỏ',
    shortDesc: 'Kiểm tra thiết bị hỗ trợ chuột nhạy (fine), màn hình chạm (coarse), hay hover.',
    badge: 'Pointer',
    icon: 'MousePointer'
  },

  // --- TRÌNH DUYỆT (3) ---
  {
    id: 'browser-compatibility',
    slug: 'compatibility',
    category: 'browser',
    title: 'Khả năng tương thích API',
    shortDesc: 'Kiểm tra trình duyệt có hỗ trợ WebAssembly, WebRTC, ServiceWorker, WebGPU, Web Audio.',
    badge: 'API',
    icon: 'CheckCircle2',
    primary: true
  },
  {
    id: 'browser-storage',
    slug: 'storage',
    category: 'browser',
    title: 'Khả năng lưu trữ',
    shortDesc: 'Kiểm tra dung lượng bộ nhớ khả dụng (Storage Quota), IndexedDB, LocalStorage.',
    badge: 'Storage',
    icon: 'Database'
  },
  {
    id: 'browser-fullscreen',
    slug: 'fullscreen',
    category: 'browser',
    title: 'Kiểm tra Fullscreen',
    shortDesc: 'Kiểm tra khả năng vào và thoát chế độ toàn màn hình không bị viền.',
    badge: '⛶',
    icon: 'Maximize2'
  },

  // --- TIỆN ÍCH (11) ---
  {
    id: 'utilities-number-to-words',
    slug: 'number-to-words',
    category: 'utilities',
    title: 'Số và số tiền thành chữ',
    shortDesc: 'Chuyển đổi số nguyên và số tiền VNĐ thành văn bản tiếng Việt chuẩn ngữ pháp.',
    badge: '10 mười',
    icon: 'FileText',
    primary: true
  },
  {
    id: 'utilities-percentage',
    slug: 'percentage',
    category: 'utilities',
    title: 'Tính phần trăm đa năng',
    shortDesc: 'Tính tỷ lệ %, tăng/giảm phần trăm, số tiền sau chiết khấu hoặc thuế.',
    badge: '%',
    icon: 'Percent'
  },
  {
    id: 'utilities-word-counter',
    slug: 'word-counter',
    category: 'utilities',
    title: 'Đếm từ và ký tự',
    shortDesc: 'Đếm số từ, ký tự (có/không khoảng trắng), số câu, số đoạn văn và thời gian đọc.',
    badge: '1 2 3',
    icon: 'ListFilter'
  },
  {
    id: 'utilities-case-converter',
    slug: 'case-converter',
    category: 'utilities',
    title: 'Đổi chữ hoa và chữ thường',
    shortDesc: 'Chuyển đổi văn bản thành VIẾT HOA, viết thường, Title Case, camelCase, snake_case.',
    badge: 'aA',
    icon: 'Type'
  },
  {
    id: 'utilities-remove-accents-slug',
    slug: 'remove-accents-slug',
    category: 'utilities',
    title: 'Bỏ dấu và tạo Slug URL',
    shortDesc: 'Xóa dấu tiếng Việt, chuyển thành chữ không dấu hoặc tạo đường dẫn URL thân thiện SEO.',
    badge: 'Slug',
    icon: 'Link'
  },
  {
    id: 'utilities-text-cleaner',
    slug: 'text-cleaner',
    category: 'utilities',
    title: 'Làm sạch văn bản',
    shortDesc: 'Loại bỏ khoảng trắng thừa, xóa dòng trống trùng lặp, xóa thẻ HTML.',
    badge: 'Clean',
    icon: 'Eraser'
  },
  {
    id: 'utilities-unit-converter',
    slug: 'unit-converter',
    category: 'utilities',
    title: 'Quy đổi đơn vị',
    shortDesc: 'Chuyển đổi độ dài, khối lượng, nhiệt độ, dung lượng byte (KB, MB, GB, TB).',
    badge: 'm ⇆ cm',
    icon: 'Scale'
  },
  {
    id: 'utilities-date-calculator',
    slug: 'date-calculator',
    category: 'utilities',
    title: 'Tính ngày tháng',
    shortDesc: 'Tính khoảng cách giữa 2 ngày hoặc cộng/trừ ngày để biết chính xác ngày tương lai.',
    badge: '📅',
    icon: 'Calendar'
  },
  {
    id: 'utilities-password-generator',
    slug: 'password-generator',
    category: 'utilities',
    title: 'Tạo mật khẩu an toàn',
    shortDesc: 'Tạo ngẫu nhiên mật khẩu mạnh theo độ dài, ký tự đặc biệt và đo độ an toàn.',
    badge: 'Pass',
    icon: 'Key',
    primary: true
  },
  {
    id: 'utilities-color-picker',
    slug: 'color-picker',
    category: 'utilities',
    title: 'Bảng chọn & chuyển mã màu',
    shortDesc: 'Bảng chọn màu trực quan, trích xuất và chuyển đổi tức thì giữa HEX, RGB, HSL.',
    badge: 'HEX',
    icon: 'Palette'
  },
  {
    id: 'utilities-json-formatter',
    slug: 'json-formatter',
    category: 'utilities',
    title: 'Định dạng & Kiểm tra JSON',
    shortDesc: 'Kiểm tra lỗi cú pháp, làm đẹp (Format indent) hoặc nén (Minify) chuỗi dữ liệu JSON.',
    badge: '{ }',
    icon: 'Code2'
  }
];
