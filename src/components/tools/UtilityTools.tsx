import React, { useState } from 'react';
import { Copy, Check, FileText, Percent, ListFilter, Type, Link as LinkIcon, Eraser, Scale, Calendar, Key, Palette, Code2, RefreshCw } from 'lucide-react';

// 1. NUMBER TO WORDS (TIẾNG VIỆT)
export const NumberToWordsTool: React.FC = () => {
  const [inputVal, setInputVal] = useState('125000000');
  const [copied, setCopied] = useState(false);

  const convertToVietnameseWords = (numStr: string): string => {
    const cleanNum = numStr.replace(/\D/g, '');
    if (!cleanNum) return '';
    if (cleanNum === '0') return 'Không đồng';

    const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

    const readGroup = (group: string, isFirst: boolean): string => {
      let [c, b, a] = group.padStart(3, '0').split('').map(Number);
      let res = '';

      if (c === 0 && b === 0 && a === 0) return '';

      if (!isFirst || c > 0) {
        res += `${digits[c]} trăm `;
      }

      if (b === 0) {
        if (a > 0 && (c > 0 || !isFirst)) res += 'lẻ ';
      } else if (b === 1) {
        res += 'mười ';
      } else {
        res += `${digits[b]} mươi `;
      }

      if (a === 1) {
        if (b > 1) res += 'mốt ';
        else res += 'một ';
      } else if (a === 5 && b > 0) {
        res += 'lăm ';
      } else if (a > 0) {
        res += `${digits[a]} `;
      }

      return res.trim();
    };

    const num = cleanNum;
    const groups: string[] = [];
    for (let i = num.length; i > 0; i -= 3) {
      groups.unshift(num.slice(Math.max(0, i - 3), i));
    }

    let result = '';
    const totalGroups = groups.length;
    for (let i = 0; i < totalGroups; i++) {
      const g = groups[i];
      const read = readGroup(g, i === 0);
      if (read) {
        const unit = units[totalGroups - 1 - i];
        result += `${read} ${unit} `;
      }
    }

    const trimmed = result.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1) + ' đồng';
  };

  const words = convertToVietnameseWords(inputVal);

  const copyText = () => {
    navigator.clipboard.writeText(words);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Nhập số hoặc số tiền:</label>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-mono text-xl text-white focus:outline-none focus:border-emerald-500"
            placeholder="Ví dụ: 5000000"
          />
        </div>

        <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 relative">
          <span className="text-xs text-slate-400 block mb-1">Kết quả đọc bằng chữ:</span>
          <p className="text-lg font-semibold text-emerald-300 pr-10">{words || '---'}</p>

          <button
            onClick={copyText}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Sao chép"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. PERCENTAGE CALCULATOR
export const PercentageTool: React.FC = () => {
  const [valA, setValA] = useState<number>(20);
  const [valB, setValB] = useState<number>(500);

  const res1 = (valA * valB) / 100;
  const res2 = valB !== 0 ? ((valA / valB) * 100).toFixed(2) : '0';
  const res3 = valA !== 0 ? (((valB - valA) / valA) * 100).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <label className="text-xs text-slate-400 block mb-1">Số A</label>
          <input
            type="number"
            value={valA}
            onChange={e => setValA(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-white"
          />
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <label className="text-xs text-slate-400 block mb-1">Số B</label>
          <input
            type="number"
            value={valB}
            onChange={e => setValB(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-semibold">{valA}% của {valB} là:</span>
          <p className="text-3xl font-black font-mono text-emerald-400 my-2">{res1}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-semibold">{valA} chiếm bao nhiêu % của {valB}:</span>
          <p className="text-3xl font-black font-mono text-cyan-400 my-2">{res2}%</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-semibold">Tăng / Giảm từ {valA} lên {valB}:</span>
          <p className={`text-3xl font-black font-mono my-2 ${Number(res3) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {Number(res3) > 0 ? `+${res3}` : res3}%
          </p>
        </div>
      </div>
    </div>
  );
};

// 3. WORD COUNTER
export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState('Omni Tool cung cấp 48 công cụ kiểm tra thiết bị trực tuyến.');

  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const lines = text === '' ? 0 : text.split('\n').length;
  const readTime = Math.ceil(words / 200);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Số từ</span>
          <p className="text-3xl font-black font-mono text-emerald-400 mt-1">{words}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Ký tự (có cách)</span>
          <p className="text-3xl font-black font-mono text-cyan-400 mt-1">{charsWithSpaces}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Ký tự (không cách)</span>
          <p className="text-3xl font-black font-mono text-white mt-1">{charsNoSpaces}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Thời gian đọc</span>
          <p className="text-3xl font-black font-mono text-amber-400 mt-1">~{readTime} phút</p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={8}
        placeholder="Dán hoặc nhập nội dung văn bản cần đếm vào đây..."
        className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
      />
    </div>
  );
};

// 4. CASE CONVERTER
export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState('Công cụ kiểm tra thiết bị Omni Tool');

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toTitle = () => {
    setText(text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  };
  const toKebab = () => {
    setText(text.trim().toLowerCase().replace(/\s+/g, '-'));
  };
  const toSnake = () => {
    setText(text.trim().toLowerCase().replace(/\s+/g, '_'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={toUpper} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono">
          CHỮ HOA (UPPER)
        </button>
        <button onClick={toLower} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono">
          chữ thường (lower)
        </button>
        <button onClick={toTitle} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono">
          Title Case
        </button>
        <button onClick={toKebab} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono">
          kebab-case
        </button>
        <button onClick={toSnake} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono">
          snake_case
        </button>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={6}
        className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
      />
    </div>
  );
};

// 5. SLUG & ACCENTS REMOVER
export const SlugGeneratorTool: React.FC = () => {
  const [text, setText] = useState('Kiểm tra màn hình và bàn phím máy tính');

  const removeAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const toSlug = (str: string) => {
    return removeAccents(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const noAccents = removeAccents(text);
  const slug = toSlug(text);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs text-slate-400 block">Nhập văn bản có dấu tiếng Việt:</label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Văn bản không dấu:</span>
          <p className="font-mono text-sm text-emerald-400">{noAccents}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Slug URL chuẩn SEO:</span>
          <p className="font-mono text-sm text-cyan-400">{slug}</p>
        </div>
      </div>
    </div>
  );
};

// 6. TEXT CLEANER
export const TextCleanerTool: React.FC = () => {
  const [text, setText] = useState('  Đây   là    văn bản   có     nhiều khoảng trắng thừa.\n\n\n\nVà nhiều dòng trống trùng lặp.');

  const cleanSpaces = () => {
    setText(text.replace(/[ \t]+/g, ' ').replace(/^\s+|\s+$/gm, ''));
  };

  const removeEmptyLines = () => {
    setText(text.split('\n').filter(line => line.trim() !== '').join('\n'));
  };

  const removeHtml = () => {
    setText(text.replace(/<[^>]*>?/gm, ''));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={cleanSpaces} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200">
          Xóa khoảng trắng thừa
        </button>
        <button onClick={removeEmptyLines} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200">
          Xóa dòng trống
        </button>
        <button onClick={removeHtml} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200">
          Lọc bỏ thẻ HTML
        </button>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={8}
        className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
      />
    </div>
  );
};

// 7. UNIT CONVERTER
export const UnitConverterTool: React.FC = () => {
  const [val, setVal] = useState<number>(100);
  const [unitType, setUnitType] = useState<'length' | 'weight' | 'digital'>('digital');

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setUnitType('digital')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            unitType === 'digital' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
          }`}
        >
          Dung lượng bộ nhớ (MB, GB, TB)
        </button>
        <button
          onClick={() => setUnitType('length')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            unitType === 'length' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
          }`}
        >
          Chiều dài (m, cm, inch)
        </button>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <label className="text-xs text-slate-400 block mb-1">Giá trị:</label>
        <input
          type="number"
          value={val}
          onChange={e => setVal(Number(e.target.value))}
          className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-white"
        />
      </div>

      {unitType === 'digital' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Kilobytes (KB)</span>
            <p className="font-mono font-bold text-white mt-1">{(val * 1024).toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Megabytes (MB)</span>
            <p className="font-mono font-bold text-emerald-400 mt-1">{val.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Gigabytes (GB)</span>
            <p className="font-mono font-bold text-cyan-400 mt-1">{(val / 1024).toFixed(4)}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Terabytes (TB)</span>
            <p className="font-mono font-bold text-white mt-1">{(val / (1024 * 1024)).toFixed(6)}</p>
          </div>
        </div>
      )}

      {unitType === 'length' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Centimet (cm)</span>
            <p className="font-mono font-bold text-white mt-1">{val} cm</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Mét (m)</span>
            <p className="font-mono font-bold text-emerald-400 mt-1">{(val / 100).toFixed(2)} m</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Inches (in)</span>
            <p className="font-mono font-bold text-cyan-400 mt-1">{(val / 2.54).toFixed(2)} in</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Feet (ft)</span>
            <p className="font-mono font-bold text-white mt-1">{(val / 30.48).toFixed(2)} ft</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 8. DATE CALCULATOR
export const DateCalculatorTool: React.FC = () => {
  const [dateA, setDateA] = useState(new Date().toISOString().split('T')[0]);
  const [dateB, setDateB] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const diffTime = Math.abs(new Date(dateB).getTime() - new Date(dateA).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <label className="text-xs text-slate-400 block mb-1">Ngày bắt đầu</label>
          <input
            type="date"
            value={dateA}
            onChange={e => setDateA(e.target.value)}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-white"
          />
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <label className="text-xs text-slate-400 block mb-1">Ngày kết thúc</label>
          <input
            type="date"
            value={dateB}
            onChange={e => setDateB(e.target.value)}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-white"
          />
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-2">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Khoảng cách thời gian</span>
        <div className="text-5xl sm:text-6xl font-black font-mono text-white">
          {diffDays} <span className="text-xl text-emerald-400 font-normal">ngày</span>
        </div>
        <p className="text-xs text-slate-400">Tương đương khoảng ~{diffWeeks} tuần</p>
      </div>
    </div>
  );
};

// 9. PASSWORD GENERATOR
export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useDigits) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    let res = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      res += charset[array[i] % charset.length];
    }
    setPassword(res);
  };

  React.useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useDigits, useSymbols]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (length < 10) return { label: 'Yếu', color: 'text-red-400', width: '25%', bg: 'bg-red-500' };
    if (length < 14) return { label: 'Trung bình', color: 'text-amber-400', width: '50%', bg: 'bg-amber-500' };
    if (length < 20) return { label: 'Mạnh', color: 'text-emerald-400', width: '75%', bg: 'bg-emerald-500' };
    return { label: 'Rất mạnh (Chuẩn bảo mật cao)', color: 'text-cyan-400', width: '100%', bg: 'bg-cyan-500' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <span className="font-mono text-lg text-emerald-300 font-bold tracking-wider break-all pr-12 select-all">
            {password || 'Vui lòng chọn ít nhất 1 loại ký tự'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={generatePassword}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Tạo lại"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={copyPassword}
              className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors"
              title="Sao chép"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Độ mạnh mật khẩu:</span>
            <span className={`font-bold ${strength.color}`}>{strength.label}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div style={{ width: strength.width }} className={`h-full ${strength.bg} transition-all duration-300`} />
          </div>
        </div>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Độ dài ký tự:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{length}</span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer select-none">
            <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} className="accent-emerald-500 rounded" />
            <span>Chữ hoa (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer select-none">
            <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} className="accent-emerald-500 rounded" />
            <span>Chữ thường (a-z)</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer select-none">
            <input type="checkbox" checked={useDigits} onChange={e => setUseDigits(e.target.checked)} className="accent-emerald-500 rounded" />
            <span>Chữ số (0-9)</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer select-none">
            <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} className="accent-emerald-500 rounded" />
            <span>Ký tự đặc biệt (!@#)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

// 10. COLOR PICKER & CONVERTER
export const ColorPickerTool: React.FC = () => {
  const [hexColor, setHexColor] = useState('#10b981');

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgb = hexToRgb(hexColor);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const hslString = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const presets = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#06b6d4', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            style={{ backgroundColor: hexColor }}
            className="w-32 h-32 rounded-2xl border-4 border-slate-700 shadow-xl flex items-center justify-center shrink-0 cursor-pointer overflow-hidden relative"
          >
            <input
              type="color"
              value={hexColor}
              onChange={e => setHexColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>

          <div className="flex-1 w-full space-y-3">
            <span className="text-xs text-slate-400 block font-semibold">Chọn hoặc nhập mã màu:</span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={hexColor}
                onChange={e => setHexColor(e.target.value)}
                className="w-36 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-sm text-white"
              />
              <span className="text-xs text-slate-400">Click vào ô màu để mở bảng chọn</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => setHexColor(p)}
                  style={{ backgroundColor: p }}
                  className="w-7 h-7 rounded-lg border border-slate-700 hover:scale-110 transition-transform"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Converted formats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Mã HEX:</span>
              <p className="font-mono font-bold text-white uppercase text-sm mt-0.5">{hexColor}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(hexColor)} className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Mã RGB:</span>
              <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{rgbString}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(rgbString)} className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Mã HSL:</span>
              <p className="font-mono font-bold text-cyan-400 text-sm mt-0.5">{hslString}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(hslString)} className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 11. JSON FORMATTER & VALIDATOR
export const JsonFormatterTool: React.FC = () => {
  const [inputJson, setInputJson] = useState('{"name":"Omni Tool","tools":48,"author":"Hung Pham","active":true,"categories":["screen","keyboard","mouse","audio","camera","device","browser","utilities"]}');
  const [error, setError] = useState<string | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: any) {
      setError(`Lỗi cú pháp JSON: ${e.message}`);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(`Lỗi cú pháp JSON: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={formatJson}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Làm đẹp JSON (Format)
          </button>
          <button
            onClick={minifyJson}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Nén JSON (Minify)
          </button>
        </div>

        <button
          onClick={() => navigator.clipboard.writeText(inputJson)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Sao chép</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono">
          {error}
        </div>
      )}

      <textarea
        value={inputJson}
        onChange={e => { setInputJson(e.target.value); setError(null); }}
        rows={12}
        className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
        placeholder="Dán mã JSON cần kiểm tra cú pháp và định dạng vào đây..."
      />
    </div>
  );
};
