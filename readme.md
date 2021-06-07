

## 使用

```jsx
import { useStatusTransition } from 'use-status-transition'

export const App = () => {
  const [isActive, setIsActive] = useState(false)
  const status = useStatusTransition({active: isActive, timeout: 500})

  return <div>{status}</div>
}
```