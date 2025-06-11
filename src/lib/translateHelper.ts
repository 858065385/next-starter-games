/**
 * 获取翻译值
 * 支持通过点号分隔的嵌套路径
 * 
 * @param obj 翻译对象
 * @param path 翻译路径，例如 'navigation.home'
 * @param defaultValue 默认值，当找不到翻译时返回
 * @returns 翻译字符串或默认值
 */
export function getTranslation(
  obj: Record<string, any> | undefined, 
  path: string,
  defaultValue: string = path
): string {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let value = obj;
  
  // 遍历嵌套路径
  for (const key of keys) {
    value = value?.[key];
    
    // 如果找不到键，返回默认值
    if (value === undefined) {
      return defaultValue;
    }
  }
  
  // 如果值不是字符串，返回默认值
  return typeof value === 'string' ? value : defaultValue;
} 