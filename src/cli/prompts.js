import inquirer from 'inquirer';

export async function promptFileDeletion(files) {
  if (!files.length) return [];

  const { toDelete } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'toDelete',
      message: 'Select files to delete:',
      choices: files.map(f => ({ name: f, value: f })),
      pageSize: 20
    }
  ]);

  return toDelete;
}
