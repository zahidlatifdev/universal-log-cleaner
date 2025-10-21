// Sample JavaScript file with logs
function calculateTotal(items) {
  console.log('Calculating total for', items.length, 'items');

  let total = 0;
  for (const item of items) {
    console.debug('Processing item:', item);
    total += item.price;
  }

  // @keep - This log should be preserved
  console.log('Final total calculation complete');

  console.error('This should be removed');
  debugger;

  return total;
}

// Commented log
// console.log('This is commented');

/* Block commented log
   console.warn('Block comment');
*/

console.info('End of file');
