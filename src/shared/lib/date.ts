export const BAKU_TIME_ZONE = 'Asia/Baku';

type DateLike = Date | string | number;

function toDate(value: DateLike): Date {
	return value instanceof Date ? value : new Date(value);
}

export function formatDateBaku(value: DateLike | null | undefined, locale = 'ru-RU'): string {
	if (value == null) return '—';
	const date = toDate(value);
	if (Number.isNaN(date.getTime())) return '—';
	return new Intl.DateTimeFormat(locale, {
		timeZone: BAKU_TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(date);
}

export function formatDateTimeBaku(value: DateLike | null | undefined, locale = 'ru-RU'): string {
	if (value == null) return '—';
	const date = toDate(value);
	if (Number.isNaN(date.getTime())) return '—';
	return new Intl.DateTimeFormat(locale, {
		timeZone: BAKU_TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}
