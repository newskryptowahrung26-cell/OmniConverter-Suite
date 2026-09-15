/**
 * Browser-native Client-side File & Media Converter Engine
 * Performs image conversions via Canvas API, text/data transformations, and client-side ZIP packaging.
 */

// Convert Image File (PNG, JPEG, WebP, BMP) in-browser
export function convertImageFile(file, targetFormat, quality = 0.92) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file.'));
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Fill white background for transparent PNGs converting to JPEG
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) return reject(new Error('Image conversion failed.'));
        
        const extensionMap = {
          'image/png': '.png',
          'image/jpeg': '.jpg',
          'image/webp': '.webp',
          'image/bmp': '.bmp'
        };

        const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || 'converted';
        const newName = `${originalName}${extensionMap[targetFormat] || '.img'}`;

        resolve({
          blob,
          filename: newName,
          size: blob.size,
          downloadUrl: URL.createObjectURL(blob)
        });
      }, targetFormat, quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for rendering.'));
    };

    img.src = url;
  });
}

// Convert JSON text to CSV or CSV to JSON
export function convertTextDocument(text, conversionType) {
  try {
    if (conversionType === 'json2csv') {
      const data = JSON.parse(text);
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('JSON input must be an array of objects.');
      }
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
          return `"${val.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      return { blob, filename: 'converted.csv', downloadUrl: URL.createObjectURL(blob) };
    }

    if (conversionType === 'csv2json') {
      const lines = text.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row.');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const result = [];
      for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        headers.forEach((header, j) => {
          obj[header] = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '') : '';
        });
        result.push(obj);
      }
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      return { blob, filename: 'converted.json', downloadUrl: URL.createObjectURL(blob) };
    }

    if (conversionType === 'txt2html') {
      const htmlContent = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Document</title></head>\n<body>\n<pre>${escapeHtml(text)}</pre>\n</body>\n</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return { blob, filename: 'converted.html', downloadUrl: URL.createObjectURL(blob) };
    }

    throw new Error('Unsupported document conversion type.');
  } catch (err) {
    return { error: err.message };
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
