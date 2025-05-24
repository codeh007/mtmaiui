import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/resource/new/res/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    
    chat"!</div>
}
