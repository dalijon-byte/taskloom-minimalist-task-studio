import { ThemeToggle } from '@/components/ThemeToggle';
import { TaskListContainer } from '@/components/tasks/TaskList';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  return (
    <>
      <ThemeToggle className="fixed top-4 right-4" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 flex flex-col items-center min-h-screen">
          <header className="w-full max-w-3xl text-center mb-8 md:mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
              Taskloom
            </h1>
            <div className="mt-3 h-1 w-24 bg-gradient-to-r from-[rgb(243_128_32)] to-[rgb(223_77_22)] mx-auto rounded-full" />
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              A minimalist, beautifully designed task list app.
            </p>
          </header>
          <main className="w-full flex-1 flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <TaskListContainer />
          </main>
          <footer className="w-full text-center py-8 mt-16 text-muted-foreground text-sm">
            <p>Built with ��️ at Cloudflare</p>
          </footer>
        </div>
      </div>
      <Toaster />
    </>
  );
}