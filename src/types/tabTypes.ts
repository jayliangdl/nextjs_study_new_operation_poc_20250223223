export interface TabContent {
  id: string;
  content: {
    configId: string;
    [key: string]: any;
  };
} 