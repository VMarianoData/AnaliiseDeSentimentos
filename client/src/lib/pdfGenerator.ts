import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import { SentimentResponse } from '@shared/schema';

// Tipagem manual para resolver problemas de compatibilidade
interface PDFKitStream {
  on(event: 'finish' | 'error', callback: (err?: any) => void): void;
  pipe<T>(destination: T): T;
  toBlobURL(contentType: string): string;
}

/**
 * Gera um PDF com uma tabela contendo os dados das análises de sentimento
 * @param analyses Lista de análises de sentimento
 * @returns Promise com URL do PDF gerado
 */
export async function generateSentimentPDF(analyses: SentimentResponse[]): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Criar um documento PDF
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
      });

      // Configurar stream
      const stream = doc.pipe(blobStream()) as unknown as PDFKitStream;

      // Configurações de estilo
      const titleFont = 'Helvetica-Bold';
      const regularFont = 'Helvetica';
      const tableTop = 150;
      const lineHeight = 25;
      const textX = 50;
      const cellPadding = 5;
      const pageWidth = doc.page.width - 100;
      const columns = {
        id: { 
          x: textX, 
          width: pageWidth * 0.1, 
          title: 'ID',
          align: 'left'
        },
        text: { 
          x: textX + pageWidth * 0.1, 
          width: pageWidth * 0.45, 
          title: 'Texto',
          align: 'left'
        },
        sentiment: { 
          x: textX + pageWidth * 0.55, 
          width: pageWidth * 0.15, 
          title: 'Sentimento',
          align: 'center'
        },
        confidence: { 
          x: textX + pageWidth * 0.7, 
          width: pageWidth * 0.15, 
          title: 'Confiança',
          align: 'center'
        },
        date: { 
          x: textX + pageWidth * 0.85, 
          width: pageWidth * 0.15, 
          title: 'Data',
          align: 'right'
        },
      };

      // Adicionar cabeçalho
      doc.font(titleFont)
         .fontSize(24)
         .fillColor('#1f8a58')
         .text('EcoBit - Análise de Sentimentos', { align: 'center' });

      // Adicionar subtítulo
      doc.moveDown()
         .fontSize(14)
         .fillColor('#666')
         .text('Relatório de Análises', { align: 'center' });

      // Adicionar data do relatório
      doc.moveDown()
         .fontSize(10)
         .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, { align: 'center' });
      
      // Adicionar linha de estatísticas
      doc.moveDown(2)
         .fontSize(12)
         .fillColor('#333');
      
      // Calcular estatísticas
      const positiveCount = analyses.filter(a => a.sentiment === 'positive').length;
      const negativeCount = analyses.filter(a => a.sentiment === 'negative').length;
      const neutralCount = analyses.filter(a => a.sentiment === 'neutral').length;
      
      doc.text(`Total de análises: ${analyses.length} | Positivas: ${positiveCount} | Negativas: ${negativeCount} | Neutras: ${neutralCount}`, { align: 'center' });

      // Desenhar cabeçalho da tabela
      doc.moveDown(2)
         .font(titleFont)
         .fontSize(10)
         .fillColor('#ffffff');
      
      // Desenhar retângulo de fundo para o cabeçalho da tabela
      doc.rect(textX - cellPadding, 
               tableTop - cellPadding, 
               pageWidth + (cellPadding * 2), 
               lineHeight + (cellPadding * 2))
         .fill('#1f8a58');
      
      // Desenhar textos do cabeçalho
      doc.fillColor('#ffffff');
      Object.values(columns).forEach(column => {
        doc.text(
          column.title, 
          column.x, 
          tableTop + 5, 
          { width: column.width, align: column.align as any }
        );
      });
      
      // Desenhar linhas da tabela
      doc.font(regularFont).fillColor('#333');
      
      let y = tableTop + lineHeight + cellPadding;
      
      // Desenhar cada linha com dados
      analyses.forEach((analysis, i) => {
        // Verificar se é necessário adicionar uma nova página
        if (y > doc.page.height - 100) {
          doc.addPage();
          // Resetar a posição Y para o topo da nova página
          y = 100;
          
          // Desenhar cabeçalho da tabela na nova página
          doc.font(titleFont)
             .fillColor('#ffffff');
          
          doc.rect(textX - cellPadding, 
                  y - cellPadding, 
                  pageWidth + (cellPadding * 2), 
                  lineHeight + (cellPadding * 2))
             .fill('#1f8a58');
          
          // Desenhar textos do cabeçalho
          Object.values(columns).forEach(column => {
            doc.text(
              column.title, 
              column.x, 
              y + 5, 
              { width: column.width, align: column.align as any }
            );
          });
          
          doc.font(regularFont).fillColor('#333');
          y += lineHeight + cellPadding;
        }
        
        // Cor de fundo alternada para as linhas (claro/escuro)
        const rowColor = i % 2 === 0 ? '#f5f5f5' : '#ffffff';
        doc.rect(textX - cellPadding, 
                y - cellPadding, 
                pageWidth + (cellPadding * 2), 
                lineHeight + (cellPadding * 2))
           .fill(rowColor);
        
        // Definir o texto de cada coluna
        // ID
        doc.text(
          analysis.id.toString(), 
          columns.id.x, 
          y + 5, 
          { width: columns.id.width, align: columns.id.align as any }
        );
        
        // Texto (truncado para caber na célula)
        const truncatedText = analysis.text.length > 50 
          ? analysis.text.substring(0, 50) + '...' 
          : analysis.text;
          
        doc.text(
          truncatedText, 
          columns.text.x, 
          y + 5, 
          { width: columns.text.width, align: columns.text.align as any }
        );
        
        // Sentimento (com cores)
        let sentimentText = '';
        let sentimentColor = '#000000';
        
        switch (analysis.sentiment) {
          case 'positive':
            sentimentText = 'Positivo';
            sentimentColor = '#389e6d';
            break;
          case 'negative':
            sentimentText = 'Negativo';
            sentimentColor = '#e53935';
            break;
          case 'neutral':
            sentimentText = 'Neutro';
            sentimentColor = '#757575';
            break;
        }
        
        doc.fillColor(sentimentColor)
           .text(
             sentimentText, 
             columns.sentiment.x, 
             y + 5, 
             { width: columns.sentiment.width, align: columns.sentiment.align as any }
           )
           .fillColor('#333');
        
        // Confiança
        doc.text(
          `${Math.round(analysis.confidence * 100)}%`, 
          columns.confidence.x, 
          y + 5, 
          { width: columns.confidence.width, align: columns.confidence.align as any }
        );
        
        // Data
        const date = new Date(analysis.createdAt).toLocaleDateString('pt-BR');
        doc.text(
          date, 
          columns.date.x, 
          y + 5, 
          { width: columns.date.width, align: columns.date.align as any }
        );
        
        // Incrementar a posição Y para a próxima linha
        y += lineHeight + (cellPadding * 2);
      });
      
      // Adicionar rodapé
      doc.fontSize(8)
         .fillColor('#999')
         .text(
          `EcoBit - Análise de Sentimentos da EcoBit | Relatório gerado em ${new Date().toLocaleString('pt-BR')}`,
          textX,
          doc.page.height - 50,
          { width: pageWidth, align: 'center' }
         );

      // Finalizar o documento e criar o URL do blob
      doc.end();
      
      stream.on('finish', () => {
        // Obter a URL do blob para download
        const url = stream.toBlobURL('application/pdf');
        resolve(url);
      });
      
      stream.on('error', (err: any) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}