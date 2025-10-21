# Sample Python file with logs
def calculate_total(items):
    print('Calculating total for', len(items), 'items')
    
    total = 0
    for item in items:
        print(f'Processing item: {item}')
        total += item.price
    
    # @keep - This should be preserved
    print('Final total calculation complete')
    
    print('This should be removed')
    
    return total

# Commented log
# print('This is commented')

if __name__ == '__main__':
    print('Running main')

