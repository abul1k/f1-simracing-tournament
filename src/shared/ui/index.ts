import { defineAsyncComponent } from 'vue'

// Динамический импорт всех Vue компонентов
const components = import.meta.glob<{ default: any }>('./**/*.vue', {
  eager: false,
})

// Маппинг путей к именам компонентов
const componentNameMap: Record<string, string> = {
  './button/index.vue': 'Button',
  './badge/index.vue': 'Badge',
}

// Создаем объект с асинхронными компонентами
const asyncComponents: Record<
  string,
  ReturnType<typeof defineAsyncComponent>
> = {}

// Инициализируем компоненты динамически
Object.keys(components).forEach((path) => {
  const componentName = componentNameMap[path]
  const componentLoader = components[path]
  if (componentName && componentLoader) {
    asyncComponents[componentName] = defineAsyncComponent(componentLoader)
  }
})

export const Button = asyncComponents.Button
export const Badge = asyncComponents.Badge
