import inquirer from 'inquirer';

export async function promptFileDeletion(files) {
  if (!files.length) return [];

  const { toDelete } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'toDelete',
      message: 'Select files to delete:',
      choices: files.flatMap(f => {
        if (typeof f === 'object' && f.separator) return new inquirer.Separator(f.separator)
        return { name: f, value: f }
      }),      
      pageSize: 20
    }
  ]);

  return toDelete;
}
