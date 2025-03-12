'use client'

import React from 'react';
import { Container, ContainerConfig, DetailType, Direction } from '../types/customContainerV1';
import { ContainerV1 } from '../components/ContainerV1';
import { DemoLayout } from '../components/DemoLayout';

export const ContainerDemoV1: React.FC = () => {
  // 使用JSON配置定义演示数据结构
//   const demoConfig: ContainerConfig = {
//     id: 'container-0',
//     type: DetailType.Container,
//     direction: Direction.Vertical,
//     size: 100,
//     details: [
//       {
//         // container-0-0
//         id: 'container-0-0',
//         type: DetailType.Container,
//         direction: Direction.Horizontal,
//         size: 50,
//         details: [
//           {
//             // detail-0-0-0
//             id: 'detail-0-0-0',
//             type: DetailType.Detail,
//             size: 100
//           }
//         ]
//       },
//       {
//         // container-0-1
//         id: 'container-0-1',
//         type: DetailType.Container,
//         direction: Direction.Vertical,
//         size: 50,
//         details: [
//           {
//             // container-0-1-0
//             id: 'container-0-1-0',
//             type: DetailType.Container,
//             direction: Direction.Horizontal,
//             size: 50,
//             details: [
//               {
//                 // detail-0-1-0-0
//                 id: 'detail-0-1-0-0',
//                 type: DetailType.Detail,
//                 size: 33
//               },
//               {
//                 // detail-0-1-0-1
//                 id: 'detail-0-1-0-1',
//                 type: DetailType.Detail,
//                 size: 33
//               },
//               {
//                 // detail-0-1-0-2
//                 id: 'detail-0-1-0-2',
//                 type: DetailType.Detail,
//                 size: 34
//               }
//             ]
//           },
//           {
//             // detail-0-1-1
//             id: 'detail-0-1-1',
//             type: DetailType.Detail,
//             size: 50
//           }
//         ]
//       }
//     ]
//   };
const randomColor = () => {
    const colors = ['#fafafa'];
    return colors[Math.floor(Math.random()*colors.length)];
}
const demoConfig: ContainerConfig = {
    id: 'container-0',
    type: DetailType.Container,
    direction: Direction.Vertical,
    size: 100,
    details: [
      {
        id: 'container-0-0',
        type: DetailType.Container,
        direction: Direction.Horizontal,
        size: 100,
        details: [
            {
                // detail0-0-0
                id: 'detail0-0-0',
                type: DetailType.Detail,
                configId: 'containerDemoV1_ContentDesc_001',
                size: 34,
                style: {
                    backgroundColor: randomColor()
                }
            },
            {
                // detail0-0-1
                id: 'detail0-0-1',
                type: DetailType.Detail,
                configId: 'containerDemoV1_ContentDesc_002',
                size: 33,
                style: {
                    backgroundColor: randomColor()
                }
            },
            {
                // detail0-0-2
                id: 'detail0-0-2',
                type: DetailType.Detail,
                configId: 'containerDemoV1_ContentDesc_003',
                size: 33,
                style: {
                    backgroundColor: randomColor()
                }
            }
        ]
      }
      // ,
      // {
      //   id: 'container-0-1',
      //   type: DetailType.Container,
      //   direction: Direction.Horizontal,
      //   size: 100,
      //   details: [
      //       {
      //           // detail0-1-1
      //           id: 'detail0-1-0',
      //           type: DetailType.Detail,
      //           size: 34,
      //           style: {
      //               backgroundColor: randomColor()
      //           }
      //       },
      //       {
      //           // detail0-1-1
      //           id: 'detail0-1-1',
      //           type: DetailType.Detail,
      //           size: 33,
      //           style: {
      //               backgroundColor: randomColor()
      //           }
      //       },
      //       {
      //           // detail0-1-2
      //           id: 'detail0-1-2',
      //           type: DetailType.Detail,
      //           size: 33,
      //           style: {
      //               backgroundColor: randomColor()
      //           }
      //       }
      //   ]
      // }
    ]
  };

// const demoConfig: ContainerConfig = {
//     id: 'container-0',
//     type: DetailType.Container,
//     direction: Direction.Vertical,
//     size: 100,
//     details: [
//       {
//         // detail0-0-0
//         id: 'detail0-0', 
//         type: DetailType.Detail,
//         size: 34
//       },
//       {
//           // detail0-0-1
//           id: 'detail0-1',
//           type: DetailType.Detail,
//           size: 33
//       },
//       {
//           // detail0-0-2
//           id: 'detail0-2',
//           type: DetailType.Detail,
//           size: 33
//       }
//     ]
//   };

  // 使用静态工厂方法初始化容器
  const demoContainer = Container.init(demoConfig);

  return (
    <DemoLayout title="Container Demo V1">
      <ContainerV1 container={demoContainer} />
    </DemoLayout>
  );
};

export default ContainerDemoV1; 