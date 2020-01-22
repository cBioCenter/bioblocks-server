bioblocks_scale_symbols = ['K', 'M', 'B', 'T', 'E', 'Z', 'Y']
si_scale_symbols = ['K', 'M', 'G', 'T', 'E', 'Z', 'Y']


def get_numeric_shorthand_suffix(num_cells, scale_symbols=bioblocks_scale_symbols):
    for i in range(24, 0, -3):
        if num_cells >= pow(10, i):
            truncated_number = round(num_cells / pow(10, i))
            suffix = scale_symbols[round(i / 3) - 1]
            return '{}{}'.format(truncated_number, suffix)
    return num_cells
