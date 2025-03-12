import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // 获取查询参数中的configId
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');

    if (!configId) {
      return NextResponse.json({
        result: 0,
        error_code: "MISSING_CONFIG_ID",
        message: "缺少configId参数"
      }, { status: 400 });
    }

    // 构建配置文件路径
    const configPath = path.join(process.cwd(), 'public', 'configs', `${configId}.json`);

    try {
      // 读取配置文件
      const fileContent = await fs.readFile(configPath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // 返回成功响应
      return NextResponse.json({
        result: 1,
        data: jsonData
      }, { status: 200 });

    } catch (error) {
      // 文件不存在或读取失败
      return NextResponse.json({
        result: 0,
        error_code: "CANNOT_FIND_CONFIGURATION_ACCORDING_TO_THE_CONFIGID",
        message: "找不到该ID的配置"
      }, { status: 404 });
    }

  } catch (error) {
    // 其他未预期的错误
    return NextResponse.json({
      result: 0,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "服务器内部错误"
    }, { status: 500 });
  }
} 