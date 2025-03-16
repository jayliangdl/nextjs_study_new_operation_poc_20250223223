import { NextResponse } from 'next/server';
import { readConfigFile, writeConfigFile } from '@/utils/configFileHandler';
import { Container, Detail } from '@/types/customContainerV1';
/**
 * 添加子元素到Layout类的配置
 */
export async function POST(request: Request) {
  try {
    // 获取请求体数据
    const body = await request.json();    
    // 验证请求数据
    if (!body.configId) {
      return NextResponse.json(
        { error: 'configId不能为空' },
        { status: 400 }
      );
    }
    if (!body.parentContainerId) {
      return NextResponse.json(
        { error: 'parentContainerId不能为空' },
        { status: 400 }
      );
    }
    if (!body.newChild) {
      return NextResponse.json(
        { error: 'newChild不能为空' },
        { status: 400 }
      );
    }

    const { configId, parentContainerId, newChild } = body;
    
    // 读取配置文件
    const readResult = await readConfigFile(configId);
    if (readResult.result !== 1) {
      return NextResponse.json(readResult, { 
        status: readResult.error_code === "MISSING_CONFIG_ID" ? 400 : 404 
      });
    }

    // 找到父容器
    const jsonData = readResult.data;
    const layoutContainer = Container.init(jsonData);
    const parentContainer = layoutContainer.findContainer(parentContainerId);  
    
    if (!parentContainer) {
      return NextResponse.json(
        { error: `找不到入参提供的父容器:${parentContainerId}` },
        { status: 400 }
      );
    }
    const newDetail = Detail.init(newChild, parentContainer); 
    // 添加子元素
    parentContainer.addDetail(newDetail);
    
    // 保存更新后的配置
    const writeResult = await writeConfigFile(configId, parentContainer.getRootContainer().toConfigJSON());
    if (writeResult.result !== 1) {
      return NextResponse.json(writeResult, { status: 500 });
    }

    return NextResponse.json({writeResult}, { status: 200 });

  } catch (error) {
    console.error('添加子元素到配置文件时发生错误:', error);
    return NextResponse.json(
      { error: '内部错误' },
      { status: 500 }
    );
  }
} 