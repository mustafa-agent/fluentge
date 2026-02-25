import { useState } from 'react';

interface ShareResultProps {
  score: number;
  total: number;
  label?: string; // e.g. "ქვიზი", "თამაში", "დონის ტესტი"
}

const APP_URL = 'https://fluentge.surge.sh';

export default function ShareResult({ score, total, label = 'ტესტი' }: ShareResultProps) {
  const [copied, setCopied] = useState(false);
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const emoji = accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👍' : '💪';

  const shareText = `მე მივიღე ${score}/${total} FluentGe-ს ინგლისურის ${label}ში! ${emoji} გამოსცადე შენც: ${APP_URL}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(APP_URL);

  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`მე მივიღე ${score}/${total} FluentGe-ს ინგლისურის ${label}ში! ${emoji} გამოსცადე შენც!`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30">
      <p className="text-center text-sm text-[var(--color-text-muted)] mb-3">📤 გაუზიარე შედეგი მეგობრებს!</p>
      <div className="flex justify-center gap-3 flex-wrap">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.476A11.929 11.929 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.588-5.932-1.61l-.424-.253-2.744.877.867-2.679-.274-.436A9.786 9.786 0 012.182 12c0-5.422 4.396-9.818 9.818-9.818S21.818 6.578 21.818 12s-4.396 9.818-9.818 9.818z"/></svg>
          WhatsApp
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Telegram
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          {copied ? '✅ დაკოპირდა!' : '🔗 ლინკის კოპირება'}
        </button>
      </div>
    </div>
  );
}
