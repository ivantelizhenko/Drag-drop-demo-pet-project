import { DragItem, ProjectStatus } from '../utils/anyTypes';
import AutoBinding from '../utils/decorators';
import { Component } from './Component';
import { Project } from './Project';
import { ProjectItem } from './ProjectItem';

import { projectState } from './States';

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragItem
{
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('projects-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @AutoBinding
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @AutoBinding
  dropHandler(event: DragEvent) {
    const dropedProjectIdevent = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      dropedProjectIdevent,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @AutoBinding
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
    projectState.addListener((projects: Project[]) => {
      const relevantProject = projects.filter(project => {
        if (this.type === 'active')
          return project.status === ProjectStatus.Active;
        if (this.type === 'finished')
          return project.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProject;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-project-list`
    )! as HTMLUListElement;

    listEl.innerHTML = '';
    this.assignedProjects.map(
      projectItem =>
        new ProjectItem(this.element.querySelector('ul')!.id, projectItem)
    );
  }

  protected renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      `${this.type} projects`.toUpperCase();
  }
}
