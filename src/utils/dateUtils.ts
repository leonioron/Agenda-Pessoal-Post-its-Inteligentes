/**
 * Utilitários para manipulação e formatação de datas em Português
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDateString(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateString(date);
}

export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = parseDateString(dateStr1).getTime();
  const d2 = parseDateString(dateStr2).getTime();
  const diffTime = d1 - d2;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatFriendlyDate(dateStr: string): string {
  const today = getTodayString();
  const diff = getDaysDifference(dateStr, today);

  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff === -1) return 'Ontem';
  if (diff > 1 && diff <= 6) {
    const daysWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const d = parseDateString(dateStr);
    return `Neste(a) ${daysWeek[d.getDay()]}`;
  }

  const d = parseDateString(dateStr);
  const day = d.getDate();
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${day} de ${months[d.getMonth()]}`;
}

export function formatFullFriendlyDate(dateStr: string): string {
  const d = parseDateString(dateStr);
  const day = d.getDate();
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const daysWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return `${daysWeek[d.getDay()]}, ${day} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export interface WeekDay {
  dateStr: string;
  dayNameShort: string;
  dayNameFull: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
}

/**
 * Retorna os 7 dias da semana (Segunda a Domingo) contendo a data informada
 */
export function getWeekDays(referenceDateStr: string): WeekDay[] {
  const refDate = parseDateString(referenceDateStr);
  const today = getTodayString();

  // No JS: 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  // Queremos semana começando na Segunda (índice 0) até Domingo (índice 6)
  const dayOfWeek = refDate.getDay();
  // Se for Domingo (0), distância para a Segunda anterior é 6 dias. Se for Segunda (1), distância é 0.
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(refDate);
  monday.setDate(monday.getDate() - distanceToMonday);

  const daysWeekShort = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const daysWeekFull = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
  ];

  const week: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(current.getDate() + i);
    const dStr = formatDateString(current);

    week.push({
      dateStr: dStr,
      dayNameShort: daysWeekShort[i],
      dayNameFull: daysWeekFull[i],
      dayNumber: current.getDate(),
      isToday: dStr === today,
      isPast: getDaysDifference(dStr, today) < 0,
    });
  }

  return week;
}

export function formatWeekRangeLabel(weekDays: WeekDay[]): string {
  if (weekDays.length === 0) return '';
  const first = parseDateString(weekDays[0].dateStr);
  const last = parseDateString(weekDays[6].dateStr);
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()} a ${last.getDate()} de ${months[first.getMonth()]} de ${first.getFullYear()}`;
  }
  return `${first.getDate()} de ${months[first.getMonth()]} a ${last.getDate()} de ${months[last.getMonth()]} de ${last.getFullYear()}`;
}
