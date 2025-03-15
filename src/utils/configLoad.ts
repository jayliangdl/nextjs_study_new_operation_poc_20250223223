const loadConfig = async (configId: string, setComponentConfig: (config: any) => void) => {
    if(!configId){
        console.error('configId是必填参数');
        return;
    }
    
    try {
        const response = await fetch(`/api/config?configId=${configId}`);
        const data = await response.json();
        if (data.result === 1) {
            setComponentConfig(data.data);
        } else {
            
            console.error(data.message || '加载配置失败' || 'congfigId:'|| configId);
        }
    } catch (err) {
        console.error('加载配置出错: ' + (err as Error).message);
    }
}

export default loadConfig;

