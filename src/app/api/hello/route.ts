import { NextResponse } from 'next/server';

// GET 请求处理
export async function GET(request: Request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'Guest';

    // 返回数据
    return NextResponse.json({
      message: `Hello ${name}!`,
      timestamp: new Date().toISOString(),
      data: {
        items: [
          { id: 1, title: 'Item 1' },
          { id: 2, title: 'Item 2' },
          { id: 3, title: 'Item 3' },
        ]
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST 请求处理
export async function POST(request: Request) {
  try {
    // 获取请求体数据
    const body = await request.json();
    
    // 验证请求数据
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // 处理请求（这里只是示例，实际应用中可能需要保存到数据库）
    const newItem = {
      id: Date.now(),
      title: body.title,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Item created successfully',
      data: newItem
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 