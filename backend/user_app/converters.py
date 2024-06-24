class IntAndStrConverter:

    regex = '[0-9a-zA-Z]+'

    def to_python(self, value):
        if value.isdigit():
            return int(value)
        else:
            return str(value)
        
    def to_url(self, value):
        return str(value)
    
class IntConverter:
    regex = '[0-9]+'

    def to_python(self, value):
        return int(value)

    def to_url(self, value):
        return str(value)