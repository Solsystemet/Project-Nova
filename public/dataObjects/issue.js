function Issue(
  id,
  title,
  description,
  createdData,
  status,
  labels,
  assignee,
  priority
) {
  this.id = id;
  this.title = title;
  this.description = description;
  this.createdData = createdData;
  this.status = status;
  this.labels = labels;
  this.assignee = assignee;
  this.priority = priority;
}
