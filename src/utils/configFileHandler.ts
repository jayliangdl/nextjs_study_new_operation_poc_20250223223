import { promises as fs } from 'fs';
import path from 'path';

export interface ConfigResponse {
  result: number;
  data?: any;
  error_code?: string;
  message?: string;
}

/**
 * 获取配置文件路径
 * @param configId 配置ID（支持子目录，如 "test/test001"）
 * @returns string 配置文件的完整路径
 */
export function getConfigPath(configId: string): string {
  // 替换 Windows 路径分隔符为 POSIX 风格
  const normalizedConfigId = configId.replace(/\\/g, '/');
  return path.join(process.cwd(), 'public', 'configs', `${normalizedConfigId}.json`);
}

/**
 * 确保目录存在
 * @param filePath 文件路径
 */
async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dirname = path.dirname(filePath);
  try {
    await fs.access(dirname);
  } catch (error) {
    await fs.mkdir(dirname, { recursive: true });
  }
}

/**
 * 根据configId读取配置文件
 * @param configId 配置ID
 * @returns Promise<ConfigResponse>
 */
export async function readConfigFile(configId: string): Promise<ConfigResponse> {
  if (!configId) {
    console.error('读取配置文件失败: 缺少 configId 参数');
    return {
      result: 0,
      error_code: "MISSING_CONFIG_ID",
      message: "缺少configId参数"
    };
  }

  try {
    const configPath = getConfigPath(configId);
    console.log('尝试读取配置文件:', configPath);
    const fileContent = await fs.readFile(configPath, 'utf-8');
    console.log('成功读取配置文件');
    const jsonData = JSON.parse(fileContent);
    console.log('成功解析 JSON 数据');
    
    return {
      result: 1,
      data: jsonData
    };
  } catch (error) {
    console.error('读取配置文件失败:', error);
    return {
      result: 0,
      error_code: "CANNOT_FIND_CONFIGURATION_ACCORDING_TO_THE_CONFIGID",
      message: `找不到该ID的配置: ${configId}`
    };
  }
}

/**
 * 写入配置文件
 * @param configId 配置ID
 * @param data 要写入的数据
 * @returns Promise<ConfigResponse>
 */
export async function writeConfigFile(configId: string, data: any): Promise<ConfigResponse> {
  console.log("writeConfigFile", configId, data);
  if (!configId) {
    console.error('写入配置文件失败: 缺少 configId 参数');
    return {
      result: 0,
      error_code: "MISSING_CONFIG_ID",
      message: "缺少configId参数"
    };
  }

  try {
    const configPath = getConfigPath(configId);
    console.log('尝试写入配置文件:', configPath);
    await ensureDirectoryExists(configPath);
    console.log('目录已创建/确认');
    await fs.writeFile(configPath, JSON.stringify(data, null, 2));
    console.log('成功写入配置文件');
    
    return {
      result: 1,
      data: data
    };
  } catch (error: any) {
    console.error('写入配置文件失败:', error);
    return {
      result: 0,
      error_code: "FAILED_TO_WRITE_CONFIG",
      message: `写入配置文件失败: ${error?.message || '未知错误'}`
    };
  }
} 