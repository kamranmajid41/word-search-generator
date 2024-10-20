import axios from 'axios';

const API_KEY = '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';

export const fetchWordsFromPrompt = async (prompt) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4', 
                messages: [
                    {
                        role: 'user',
                        content: `List words related to: "${prompt}" in a csv format with less than 50 characters in your response.`
                    }
                ],
                max_tokens: 50,
                temperature: 0.5,
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout: 5000, // Set timeout to 5000 milliseconds (5 seconds)
            }
        );

        // Check if response is as expected
        if (response.data.choices && response.data.choices.length > 0) {
            const words = response.data.choices[0].message.content
                .trim()
                .split(',')
                .map(word => word.trim().toUpperCase()); 
            
            console.log(words); 
            return words;
        } else {
            console.error('Unexpected response structure:', response.data);
            return [];
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
            throw new Error('Request timed out, please try again.');
        }
        console.error('Error fetching words:', error.response ? error.response.data : error.message);
        throw error; 
    }
};
