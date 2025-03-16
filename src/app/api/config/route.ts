import { NextResponse } from 'next/server';
import { readConfigFile } from '@/utils/configFileHandler';

export async function GET(request: Request) {
  try {
    // 获取查询参数中的configId
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');

    const result = await readConfigFile(configId || '');
    
    if (result.result === 0) {
      return NextResponse.json(result, { 
        status: result.error_code === "MISSING_CONFIG_ID" ? 400 : 404 
      });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // 其他未预期的错误
    return NextResponse.json({
      result: 0,
      error_code: "INTERNAL_SERVER_ERROR",
      error: "服务器内部错误"
    }, { status: 500 });
  }
} 