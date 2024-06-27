import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import './App.css';
import clipboardCopy from 'clipboard-copy'; // Импортируем библиотеку для копирования в буфер обмена

const Referat = () => {
    const [fileContent, setFileContent] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false); // Состояние для отслеживания состояния копирования

    // Функция обработки загрузки файла
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = async () => {
            const arrayBuffer = reader.result;
            const result = await mammoth.extractRawText({ arrayBuffer });
            setFileContent(result.value);
        };

        reader.readAsArrayBuffer(file);
    }, []);

    // Получение свойств для Dropzone из библиотеки react-dropzone
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.docx' });

    // Функция для генерации аннотации
    const generateSummary = async () => {
        if (!fileContent) {
            alert('Сначала загрузите файл.');
            return;
        }

        setLoading(true); // Установка состояния загрузки

        try {
            const prompt = "Верни мне ответ в виде:\n" + 
                "1. Цель и задачи работы:\n" + 
                "2. Объект и предмет исследования:\n" + 
                "3. Методы исследования:\n" + 
                "4. Результаты исследования:\n" +
                "5. Научная новизна и практическая значимость:\n" + 
                "6. Область применения:\n" + 
                "7. Объем работы:\n" +
                "Сам текст: ";
                
            const response = await fetch('http://127.0.0.1:5000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: fileContent, prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error('HTTP ошибка! Статус: ${response.status}');
            }

            const data = await response.json();
            if (data.summary != null) {
                setSummary(data.summary);
                setCopied(false); // Сбрасываем состояние копирования
            } else {
                alert('Ошибка при получении аннотации.');
            }
        } catch (error) {
            console.error('Ошибка при генерации аннотации:', error);
            alert('Произошла ошибка при обращении к серверу.');
        } finally {
            setLoading(false); // Сброс состояния загрузки
        }
    };

    // Функция для копирования текста в буфер обмена
    const copySummary = () => {
        clipboardCopy(summary)
            .then(() => {
                setCopied(true); // Устанавливаем состояние "Скопировано"
            })
            .catch(err => {
                console.error('Не удалось скопировать текст:', err);
            });
    };

    // Эффект для вывода в консоль обновленной аннотации
    useEffect(() => {
        console.log('Обновлённая аннотация:', summary);
    }, [summary]);

    return (
        <div className="container">
            <ul className='elements'>
                <li>
                    <ul className='extract'> 
                        <li>
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p>Перетащите .docx файл сюда, или нажмите для выбора файла</p>
                            </div>
                        </li>
                        <li>
                            <button className="extract-button" onClick={generateSummary} disabled={loading}>
                                Составить
                            </button>
                        </li>
                    </ul>
                </li>
                <li>
                    <div className="summary">
                        <div className="code-header">
                            <h3> Реферат </h3>
                            {copied ? (
                                <span style={{ color: 'green' }}>Скопировано</span>
                            ) : (
                                <button className="copy-button" onClick={copySummary} disabled={!summary}>
                                    Копировать
                                </button>
                            )}
                        </div>
                        <p>{summary}</p>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Referat;
