document.addEventListener('DOMContentLoaded', function() {
    const industrySelect = document.querySelector('select');
    const styleButtons = document.querySelectorAll('.space-x-3 button');
    const projectNameInput = document.getElementById('projectName');
    const locationInput = document.getElementById('location');
    const typeInput = document.getElementById('type');
    const priceInput = document.getElementById('price');
    const sellingPointsTextarea = document.getElementById('sellingPoints');
    const generateBtn = document.getElementById('generate-btn');
    const resultCard = document.getElementById('result-card');

    generateBtn.addEventListener('click', async function() {
        const industry = industrySelect.value;
        let selectedStyle = '口语化'; // Default style
        styleButtons.forEach(button => {
            if (button.classList.contains('bg-blue-600')) {
                selectedStyle = button.textContent;
            }
        });

        const projectName = projectNameInput.value;
        const location = locationInput.value;
        const type = typeInput.value;
        const price = priceInput.value;
        const sellingPoints = sellingPointsTextarea.value;

        if (!projectName || !sellingPoints) {
            alert('请输入楼盘/酒店名称和核心卖点！');
            return;
        }

        // 设置按钮状态为加载中
        generateBtn.textContent = '生成中...';
        generateBtn.disabled = true;
        generateBtn.classList.add('opacity-70', 'cursor-not-allowed');

        // 构造更详细的提示词
        const prompt = `请为${industry}行业，以${selectedStyle}风格生成一条朋友圈文案。内容包括：
        楼盘/酒店名称: ${projectName}
        位置: ${location}
        户型: ${type}
        价格: ${price}
        核心卖点: ${sellingPoints}
        要求文案具有吸引力，能够促使客户点击了解详情。`;

        console.log('AI生成提示词:', prompt);

        try {
            // 使用硅基流动平台API生成文案
            console.log('调用硅基流动API生成文案...');
            
            // 根据API文档更新正确的URL
            const apiUrl = 'https://api.siliconflow.cn/v1/chat/completions';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-xmdwpdbxjlobveagqdadvpeydxgvwwgqylcinsdgmqmxxtot'
                },
                body: JSON.stringify({
                    model: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1024,
                    temperature: 0.7,
                    top_p: 0.7
                })
            });

            console.log('API响应状态:', response.status);
            
            if (!response.ok) {
                // 获取详细错误信息
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: '无法解析错误响应' };
                }
                throw new Error(`API请求失败: ${response.status} ${response.statusText}. 错误信息: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('API响应数据:', data);
            
            if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
                throw new Error('API返回的数据格式不正确');
            }
            
            const aiGeneratedText = data.choices[0].message.content;
            displayResult(aiGeneratedText, generateBtn, resultCard);
            // 模拟数据已移除，完全使用硅基流动API
        } catch (error) {
            console.error('文案生成失败:', error);
            // 提供更详细的错误信息
            alert(`文案生成失败: ${error.message}\n\n请检查网络连接或稍后重试。`);
            // 恢复按钮状态
            generateBtn.textContent = '一键生成文案';
            generateBtn.disabled = false;
            generateBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        }
    });

function displayResult(text, generateBtn, resultCard) {
    // 使用更可靠的头像占位符，完全移除对via.placeholder.com的依赖
    const avatarUrl = 'https://api.dicebear.com/7.x/bottts/svg?seed=ai-helper&size=48';
    
    // 先显示基础结构，文本区域先留空
    resultCard.innerHTML = `
        <div class="flex items-center mb-6">
            <img src="${avatarUrl}" alt="AI助手头像" class="w-12 h-12 rounded-full mr-4">
            <div>
                <p class="font-semibold text-lg">智撰云</p>
                <p class="text-gray-500 text-sm">刚刚 • AI生成内容</p>
            </div>
        </div>
        <p class="text-base text-gray-800 leading-relaxed whitespace-pre-wrap mb-6" id="typing-text"></p>
        <button class="copy-btn w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制文案
            </button>
    `;
    resultCard.classList.remove('hidden');
    
    // 实现打字机效果
    const typingText = document.getElementById('typing-text');
    let index = 0;
    const speed = 30; // 每个字符的延迟时间（毫秒）
    
    function typeWriter() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        } else {
            // 打字完成后恢复按钮状态
            generateBtn.textContent = '一键生成文案';
            generateBtn.disabled = false;
            generateBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        }
    }
    
    // 开始打字动画
    typeWriter();
}

// 文案风格选择功能
styleButtons.forEach(button => {
    button.addEventListener('click', () => {
        styleButtons.forEach(btn => btn.classList.remove('bg-blue-600', 'text-white'));
        styleButtons.forEach(btn => btn.classList.add('bg-gray-100', 'text-gray-700'));
        button.classList.remove('bg-gray-100', 'text-gray-700');
        button.classList.add('bg-blue-600', 'text-white');
    });
});

// 复制功能
resultCard.addEventListener('click', (event) => {
    if (event.target.closest('.copy-btn')) {
        const textToCopy = resultCard.querySelector('.text-base').textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('文案已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
        });
    }
});
});