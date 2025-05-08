export function formatToBRL(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }
  
  export function parseBRLToNumber(formatted: string): number {
    const cleaned = formatted
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".");
    return parseFloat(cleaned);
  }
  
  export function maskBRLInput(value: string): string {
    const numeric = value.replace(/[^\d]/g, "");
    const number = parseFloat(numeric) / 100;
    if (isNaN(number)) return "";
    return formatToBRL(number);
  }
  