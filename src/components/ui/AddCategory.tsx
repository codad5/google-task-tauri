import { IconButton, Button, FormControl, FormLabel, Input, ButtonGroup, Box, Popover, useDisclosure, PopoverTrigger, PopoverContent, FocusLock, PopoverArrow, PopoverCloseButton, Stack} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useRef } from 'react'
import { useRecoilValue , useSetRecoilState} from 'recoil'
import { taskObjectSelector, taskCategoriesListState } from '../../config/states'



const Form = ({categoryNameRef, onCancel}: {categoryNameRef: React.RefObject<HTMLInputElement>, onCancel: () => void}) => {
    
    const taskObject = useRecoilValue(taskObjectSelector)
    const setTaskCategories = useSetRecoilState(taskCategoriesListState)
    
    const addNewCategory = () => {
        if (!categoryNameRef.current || categoryNameRef.current.value === '') return;
            taskObject.addNewTaskCategory(categoryNameRef.current?.value || '')
            .then((d) => { if (!d) return console.log('category not added') })
            .then(() => { 
                taskObject.getTaskCategories().then((data) => {
                    console.log('data', data)
                    setTaskCategories(data)
                    // clear input
                    categoryNameRef.current!.value = ''
                })
            })
    }

    return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel htmlFor={"categoryName"}>Category Name</FormLabel>
              <Input ref={categoryNameRef} id={"categoryName"} placeholder={"Category Name"} />
        </FormControl>
      <ButtonGroup display='flex' justifyContent='flex-end'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme='teal' onClick={addNewCategory}>
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  )
}

export default function AddCategoryComponent() {
    const { onOpen, onClose, isOpen } = useDisclosure()
    const categoryNameRef = useRef<HTMLInputElement>(null)
    return (
        <>
            <Box>
                <Popover
                    isOpen={isOpen}
                    initialFocusRef={categoryNameRef}
                    onOpen={onOpen}
                    onClose={onClose}
                    placement='right'
                    closeOnBlur={false}
                >
                    <PopoverTrigger>
                        <IconButton
                            isRound={true}
                            variant='solid'
                            colorScheme='teal'
                            aria-label='Done'
                            size='sm'
                            icon={<AddIcon />}
                        />
                    </PopoverTrigger>
                    <PopoverContent p={5}>
                        <FocusLock persistentFocus={false}>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <Form categoryNameRef={categoryNameRef} onCancel={onClose} />
                        </FocusLock>
                    </PopoverContent>
                
                </Popover>
            </Box>
        </>
    )
}