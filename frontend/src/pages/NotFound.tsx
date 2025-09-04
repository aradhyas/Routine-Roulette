import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/KUI'
import { BrainWithMessage } from '../components/Brain'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="container py-lg">
      <div className="text-center mb-xl">
        <BrainWithMessage 
          mood="frustrated" 
          size="lg" 
          message="Page not found! 🤔"
        />
      </div>

      <EmptyState
        icon="🔍"
        title="Page Not Found"
        description="Let's get back on track!"
        action={{
          label: "Go to Tasks",
          onClick: () => navigate('/add-tasks')
        }}
      />
    </div>
  )
}
