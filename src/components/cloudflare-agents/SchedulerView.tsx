import "./Schedule.css";

interface SchedulerProps {
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}
