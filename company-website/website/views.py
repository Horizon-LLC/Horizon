from flask import Blueprint, render_template


views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("base.html")

@views.route('/about')
def about():
    people = [
        {'name': 'Caden Minniefield - CEO of Horizon', 'image_filen':'Caden_Minniefield.jpg', 'desc': 'Internship at Southern California Edison completing data analyst work for Substation Infrastructure Replacement. \nWorking on AI art website project to make art more accessible.'},
        {'name': 'Keita Katsumi', 'image_filen':'Keita_Katsumi.jpg', 'desc': 'Works at Global Logic Associate analyst. \nGPU computing research assistant at CPP. \nTeaching Japanese at Oh-Fuji in LA.'},
        {'name': 'Jacob San Gabriel', 'image_filen':'Jacob_San_Gabriel.jpg', 'desc': 'California State Polytechnic University, Pomona Student.'},
        {'name': 'Hikaru Goto', 'image_filen':'Hikaru_Goto.jpg', 'desc': 'Student at California State Polytechnic University, Pomona. \nInternship at VFX Company.'},
        {'name': 'Adrian Caballero', 'image_filen':'Adrian_Caballero.jpg', 'desc': 'Student at California State Polytechnic University, Pomona. \nInterested in cloud computing and digital forensics. \nWorking currently as a personal care aid'}
    ]
    return render_template("about.html", people=people)

@views.route('/logs')
def logs():
    return render_template("logs.html")
 
@views.route('/srs')
def srs():
    return render_template("srs.html")

