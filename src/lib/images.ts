// Helpers de imagem que rodam NO NAVEGADOR (client-side).
// Comprimir antes de enviar reduz tokens (= custo da IA) e evita estourar o
// limite de payload do servidor. Para escolher fotos, ~1024px é mais que suficiente
// (a própria Anthropic reduz imagens grandes internamente).

const MAX_LADO = 1024; // px no maior lado
const QUALIDADE_JPEG = 0.72;

/** Lê um File como Data URL. */
function lerComoDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

/** Carrega uma Data URL em um HTMLImageElement. */
function carregarImagem(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
    img.src = dataUrl;
  });
}

/**
 * Redimensiona (mantendo proporção) e recomprime uma imagem para JPEG.
 * Se algo falhar, devolve a Data URL original como fallback.
 */
export async function comprimirImagem(file: File): Promise<string> {
  const original = await lerComoDataURL(file);
  try {
    const img = await carregarImagem(original);

    const escala = Math.min(1, MAX_LADO / Math.max(img.width, img.height));
    const largura = Math.round(img.width * escala);
    const altura = Math.round(img.height * escala);

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;

    ctx.drawImage(img, 0, 0, largura, altura);
    return canvas.toDataURL("image/jpeg", QUALIDADE_JPEG);
  } catch {
    return original;
  }
}

/**
 * Comprime várias imagens em LOTES, cedendo o thread entre cada lote pra a UI
 * não congelar (com 30 fotos, fazer tudo de uma vez trava a tela). Reporta progresso.
 */
export async function comprimirVarias(
  files: File[],
  onProgresso?: (feitas: number, total: number) => void,
): Promise<string[]> {
  const total = files.length;
  const LOTE = 4;
  const saida: string[] = [];
  for (let i = 0; i < total; i += LOTE) {
    const lote = files.slice(i, i + LOTE);
    const res = await Promise.all(lote.map((f) => comprimirImagem(f)));
    saida.push(...res);
    onProgresso?.(saida.length, total);
    // Cede o thread: deixa o navegador pintar o progresso/animação antes do próximo lote.
    await new Promise((r) => setTimeout(r, 0));
  }
  return saida;
}
