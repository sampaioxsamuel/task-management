import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) throw new NotFoundException();

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);

    return task;
  }

  updateTaskStatus(id: string, newStatus: TaskStatus) {
    const task = this.getTaskById(id);

    /* I created a validation pipe to resolve this
    if (!Object.values(TaskStatus).includes(TaskStatus[newStatus])) {
      throw new BadRequestException(
        'Status is incorrect, try: DONE, IN_PROGRESS, OPEN',
      );
    }*/

    task.status = newStatus;

    return task;
  }

  deleteTaskByID(id: string) {
    const taskToDelete = this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id);
  }
}
