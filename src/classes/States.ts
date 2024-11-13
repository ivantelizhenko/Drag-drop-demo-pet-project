import { Listener, ProjectStatus } from '../utils/anyTypes';
import { Project } from './Project';

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new ProjectState();
    return this.instance;
  }

  private updateListeners() {
    this.listeners.forEach(fn => fn(this.projects.slice()));
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.trunc(Math.random() * 100000).toString() + Date.now().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(project => project.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }
}

export const projectState = ProjectState.getInstance();
