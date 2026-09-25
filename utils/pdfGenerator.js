import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePatientPDF = async (patientData) => {
    try {
        const templatePath = path.join(__dirname, '../templates/patientReport.ejs');

        const htmlContent = await ejs.renderFile(templatePath, { patient: patientData });

        const browser = await puppeteer.launch({
            headless: true, // Use new headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle2', 
            timeout: 60000 // Increase timeout to 60 seconds
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error('Error in PDF generation utility:', error);
        throw error;
    }
};
