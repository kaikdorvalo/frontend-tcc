import { ChevronDownIcon, EditIcon, Plus, Save, Trash, X } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { Calendar } from './components/ui/calendar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

interface Course {
  _id: string
  name: string
  workload: number
  startDate: Date
  disciplines: Discipline[]
}

interface Discipline {
  _id: string
  name: string
}

interface CourseComponentProp {
  course: Course
  getAllCourses: () => void
}

interface DisciplineComponentProps {
  discipline?: Discipline
  courseId: string
  getAllCourses: () => void
  createMode?: boolean
  setCreateMode?: (value: boolean) => void
}

const DiciplineComponent = ({ discipline, courseId, getAllCourses, createMode, setCreateMode }: DisciplineComponentProps) => {
  const [editMode, setEditMode] = useState(createMode || false)
  const [value, setValue] = useState(discipline?.name || '')

  function updateDiscipline() {
    return api.put('/disciplines', { id: discipline?._id, name: value }).then(() => {
      getAllCourses()
      setEditMode(false)
    })
  }

  function createDiscipline() {
    console.log(courseId)
    console.log("id curso")
    return api.post('/course-disciplines/disciplines', { id: courseId, name: value }).then(() => {
      setValue('')
      getAllCourses()
      setCreateMode?.(false)
    })
  }

  function deleteDiscipline() {
    return api.delete(`/course-disciplines/courses/${courseId}/disciplines/${discipline?._id}`).then(() => {
      setEditMode(false)
      getAllCourses()
    })
  }

  return (
    <Card className='w-full'>
      <CardHeader className='flex justify-end'>
        {editMode && !createMode &&
          <Button onClick={deleteDiscipline} className='w-8 h-8 cursor-pointer' variant={'destructive'}>
            <Trash size={20} />
          </Button>
        }
        <Button className='w-8 h-8 cursor-pointer' variant={'outline'} onClick={() => {
          if (editMode && !createMode) {
            updateDiscipline()
          } else if (createMode) {
            createDiscipline()
          } else {
            setEditMode(true)
          }
        }}>
          {!editMode && <EditIcon size={20} />}
          {editMode && <Save size={20} />}
        </Button>

        {editMode && <Button onClick={() => {
          setEditMode(false)
          setCreateMode?.(false)
        }} className='w-8 h-8 cursor-pointer' variant={'outline'}><X size={20} /></Button>}

      </CardHeader>
      <CardContent>
        <p className='mb-1 '>Nome:</p>
        {!editMode && <p>{discipline?.name}</p>}
        {editMode && <Input value={value} onChange={(event) => setValue(event.target.value)} />}
      </CardContent>
    </Card>
  )
}

const CourseComponent = ({ course, getAllCourses }: CourseComponentProp) => {

  const startDate = new Date(course?.startDate || '')
  const [editMode, setEditMode] = useState(false)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(startDate)

  const [name, setName] = useState(course?.name || '')
  const [workload, setWorkload] = useState(course?.workload || 0)
  const [createDisciplineMode, setCreateDisciplineMode] = useState(false)

  function updateCourse() {
    return api.put(`/courses/${course._id}`, { name: name, workload: workload, startDate: date }).then(() => {
      getAllCourses()
      setEditMode(false)
    })
  }

  function deleteCourse() {
    return api.delete(`/course-disciplines/courses/${course._id}`).then(() => getAllCourses())
  }

  return <Card className='w-80'>

    <CardHeader className='flex justify-end'>
      {editMode && <Button onClick={deleteCourse} className='w-8 h-8 cursor-pointer' variant={'destructive'}>
        <Trash size={20} />
      </Button>}
      <Button className='w-8 h-8 cursor-pointer' variant={'outline'} onClick={() => {
        if (editMode) {
          updateCourse()
        } else {
          setEditMode(true)
        }
      }}>
        {!editMode && <EditIcon size={20} />}
        {editMode && <Save size={20} />}
      </Button>
      {editMode && <Button onClick={() => {
        setName(course?.name || '')
        setWorkload(course?.workload || 0)
        setDate(new Date(course?.startDate || ''))
        setEditMode(false)
      }} className='w-8 h-8 cursor-pointer' variant={'outline'}><X size={20} /></Button>}
    </CardHeader>

    <CardTitle className='text-center mx-10'>
      {!editMode && course?.name}
      {editMode && <Input value={name} onChange={(event) => setName(event.target.value)} placeholder='Nome do curso' />}
    </CardTitle>
    <CardContent>
      {!editMode &&
        <>
          <p>Carga horária: {course?.workload}</p>
          <p>Data de Início: {startDate.toLocaleDateString("pt-BR")}</p>
          <p>Disciplinas:</p>
        </>
      }

      {editMode &&
        <div className='w-full flex flex-col gap-2'>
          <Input value={workload} onChange={(event) => setWorkload(Math.floor(Number(event.target.value)))} type='number' placeholder='Carga horária' />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : "Data de início"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date)
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      }

      <div className='mt-10 flex flex-col gap-2 items-center'>
        {course?.disciplines.map((discipline) => (
          <DiciplineComponent getAllCourses={getAllCourses} courseId={course._id} discipline={discipline} />
        ))}

        {!createDisciplineMode &&
          <Button onClick={() => {
            setCreateDisciplineMode(true)
          }} variant={'outline'} className='rounded-full w-10 h-10 mt-4 cursor-pointer'>
            <Plus size={30} />
          </Button>
        }

        {createDisciplineMode &&
          <DiciplineComponent getAllCourses={getAllCourses} courseId={course._id} createMode={true} setCreateMode={setCreateDisciplineMode} />
        }
      </div>
    </CardContent>
  </Card>
}



function App() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  const [courses, setCourses] = useState<Course[]>([])

  const [name, setName] = useState('')
  const [workload, setWorkload] = useState<number>()

  function getAllCourses() {
    api.get('courses').then((res) => setCourses(res.data))
  }

  function createCourse() {
    if (name.trim() !== '' && workload && date) {
      return api.post('/courses', { name, workload, startDate: date }).then(() => getAllCourses())
    }
  }

  useEffect(() => {
    getAllCourses()
  }, [])

  return (
    <div className='w-full px-10 py-10 flex gap-20'>
      <div className='w-90 h-full flex flex-col gap-2 items-center'>
        <div>Criar curso</div>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder='Nome do curso' />
        <Input value={workload} onChange={(event) => setWorkload(Math.floor(Number(event.target.value)))} type='number' placeholder='Carga horária' />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Data de início"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => createCourse()} className='w-full cursor-pointer'>Criar curso</Button>
      </div>

      <div className='w-full gap-5 h-50 flex flex-wrap'>
        {courses.map((course) => (
          <CourseComponent getAllCourses={getAllCourses} key={course._id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default App
