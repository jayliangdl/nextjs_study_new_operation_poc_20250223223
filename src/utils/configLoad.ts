const loadConfig = (configId: string, setComponentConfig: (config: any) => void) => {
    if(!configId){
        console.error('configId是必填参数');
        return;
    }
    console.log('configId', configId);
    fetch(`/api/config?configId=${configId}`)
        .then(res => res.json())
        .then(data => {
            if (data.result === 1) {
                setComponentConfig(data.data);
            }
            else{
                console.error(data.message || '加载配置失败');
            }
        })
        .catch(err => {
            console.error('加载配置出错: ' + err.message);
        });
}

export default loadConfig;

