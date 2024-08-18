import {
  Controller,
  Req,
  Res,
  HttpStatus,
  Get,
  Patch,
  Delete,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Request, Response } from 'express'
import { CustomerService } from './customer/customer.service'
import { MechanicService } from './mechanic/mechanic.service'
import { REAgentService } from './real-estate-agent/agent.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly mechanicService: MechanicService,
    private readonly agentService: REAgentService,
  ) {}

  @Get('customer')
  async getAllCustomers(@Res() res: Response) {
    try {
      const allCustomers = await this.customerService.getAllCustomers()
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found ${allCustomers.length} customers!`,
        data: allCustomers,
      })
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Could not find customers',
        error: error,
      })
    }
  }

  @Get('customer/:id')
  async getCustomerById(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    if (!id) {
    }
    try {
      const customer = await this.customerService.getCustomerById(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found customer!`,
        data: customer,
      })
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: `Could not find the customer with id:${id}`,
        error: error,
      })
    }
  }

  @Get(':id/customer')
  async getCustomerByUserId(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    if (!id) {
    }
    try {
      const customer = await this.customerService.getCustomerByUserId(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found customer!`,
        data: customer,
      })
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: `Could not find the customer with userId:${id}`,
        error: error,
      })
    }
  }

  @Patch('customer/:id')
  async updateCustomerById(@Req() req: Request, @Res() res: Response) {
    const { body, params } = req

    try {
      if (!params.id || !body.customer) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The request is invalid,\n please provide a valid request',
          error: new Error('Invalid Request Body'),
        })
      }
      const updatedCustomer = await this.customerService.updateCustomerById(
        params.id,
        body.customer,
      )
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found customer!`,
        data: updatedCustomer,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message || `Could not find the customer with id:${params.id}`,
        error: error.name,
        details: error,
      })
    }
  }

  @Patch('customer')
  async updateCustomersByFilters(@Req() req: Request, @Res() res: Response) {
    const { body } = req

    try {
      if (!body.filter || !body.update) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The request is invalid,\n please provide a valid request',
          error: new Error('Invalid Request Body'),
        })
      }
      const updatedCustomers =
        await this.customerService.updateMultipleCustomersByfilters(
          body.filter,
          body.update,
        )
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found customer!`,
        data: updatedCustomers,
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: `Could not find the customers for given filters`,
        error: error,
      })
    }
  }

  @Delete('customer/:id')
  async deleteCustomerById(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params

    try {
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The request is invalid,\n please provide a valid request',
          error: new Error('Invalid Request Body'),
        })
      }
      const deletedCustomer = await this.customerService.deleteCustomerById(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Deleted customer!`,
        data: deletedCustomer,
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: `Could not find the customer with id:${id}`,
        error: error,
      })
    }
  }

  /************************
   *************************
   *  Mechanic Controllers  *
   *************************
   ************************/

  @Patch('mechanic/approve/:id')
  async approveMechanic(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params

    console.log(id)
    if (typeof id == 'string') {
      const approvedUser = await this.mechanicService.approveMechanic(id)
      if (!approvedUser) {
        return undefined
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'mechanic succesfully approved',
        data: approvedUser,
      })
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Invalid Query Parameter',
        error: 'Bad Request',
      })
    }
  }

  @Get('mechanics')
  async getAllMechanics(@Res() res: Response) {
    try {
      const allMechanics = await this.mechanicService.getAllMechanics()
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found ${allMechanics.length} mechanics!`,
        data: allMechanics,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Could not find mechanics',
        error: error.name || 'Internal Server Error',
      })
    }
  }

  @Get('mechanic/:id')
  async getMechanicById(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    if (!id) {
    }
    try {
      const mechanic = await this.mechanicService.getMechanicById(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found mechanic!`,
        data: mechanic,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          `An Unexpected Error Occured.\n Please try again after some time.`,
        error: error.name || 'Internal Server Error',
      })
    }
  }

  @Get(':id/mechanic')
  async getMechanicByUserId(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    if (!id) {
    }
    try {
      const mechanic = await this.mechanicService.getMechanicByUserId(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found mechanic!`,
        data: mechanic,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          `An Unexpected Error Occured.\n Please try again after some time.`,
        error: error.name || 'Internal Server Error',
      })
    }
  }

  @Patch('mechanic/:id')
  async updateMechanicById(@Req() req: Request, @Res() res: Response) {
    const { body, params } = req

    try {
      if (!params.id || !body.mechanic) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The request is invalid,\n please provide a valid request',
          error: new Error('Invalid Request Body'),
        })
      }
      const updatedMechanic = await this.mechanicService.updateMechanicById(
        params.id,
        body.mechanic,
      )
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found mechanic!`,
        data: updatedMechanic,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          `An Unexpected Error Occured.\n Please try again after some time.`,
        error: error.name || 'Internal Server Error',
      })
    }
  }

  @Patch('mechanic')
  async updateMechanicsByFilters(@Req() req: Request, @Res() res: Response) {
    const { body } = req

    try {
      if (!body.filter || !body.update) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The request is invalid,\n please provide a valid request',
          error: new Error('Invalid Request Body'),
        })
      }
      const updatedMechanics =
        await this.mechanicService.updateMultipleMechanicsByfilters(
          JSON.parse(body.filter),
          JSON.parse(body.update),
        )
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Updated Mechanics!`,
        data: updatedMechanics,
      })
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: `Could not find the mechanics for given filters`,
        error: error,
      })
    }
  }

  @Delete('mechanic/:id')
  async deleteMechanicById(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params

    try {
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The request is invalid,\n please provide a valid request',
          error: new Error('Invalid Request Body'),
        })
      }
      const deletedMechanic = await this.mechanicService.deleteMechanicById(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Deleted mechanic!`,
        data: deletedMechanic,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          `An Unexpected Error Occured.\n Please try again after some time.`,
        error: error.name || 'Internal Server Error',
      })
    }
  }

  /************************
   *************************
   *  Agents  Controllers  *
   *************************
   ************************/

  @Get('re-agent')
  async getAllREAgents(@Res() res: Response) {
    try {
      const reAgents = await this.agentService.getAllREAgents()
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found ${reAgents.length} real estate agents!`,
        data: reAgents,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Could not find mechanics',
        error: error.name || 'Internal Server Error',
      })
    }
  }

  @Get('re-agent/:id')
  async getReAgentById(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    if (!id) {
    }
    try {
      const reAgent = await this.agentService.getREAgentById(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found real estate agent!`,
        data: reAgent,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          `An Unexpected Error Occured.\n Please try again after some time.`,
        error: error.name || 'Internal Server Error',
      })
    }
  }

  @Get(':id/re-agent')
  async getReAgentByUserId(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    if (!id) {
    }
    try {
      const reAgent = await this.agentService.getREAgentByUserId(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Found real estate agents!`,
        data: reAgent,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          `An Unexpected Error Occured.\n Please try again after some time.`,
        error: error.name || 'Internal Server Error',
      })
    }
  }

  @Patch('re-agent/:id')
  async updateReAgentById(@Req() req: Request, @Res() res: Response) {
    const { body, params } = req
    console.log('Params', params)

    try {
      if (!params.id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The request is invalid,\n please provide a valid request',
          error: {
            code: 400,
          },
        })
      }
      const updatedAgent = await this.agentService.updateREAgentById(
        params.id,
        body,
      )
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Updated Real estate agent!`,
        data: updatedAgent,
      })
    } catch (error) {
      console.error(error)
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          `An Unexpected Error Occured.\n Please try again after some time.`,
        error: error.name || 'Internal Server Error',
      })
    }
  }

  //  @Patch('mechanic')
  //  async updateMechanicsByFilters(@Req() req: Request, @Res() res: Response) {
  //    const { body } = req

  //    try {
  //      if (!body.filter || !body.update) {
  //        res.status(HttpStatus.BAD_REQUEST).json({
  //          success: false,
  //          message: 'The request is invalid,\n please provide a valid request',
  //          error: new Error('Invalid Request Body'),
  //        })
  //      }
  //      const updatedMechanics =
  //        await this.mechanicService.updateMultipleMechanicsByfilters(
  //          JSON.parse(body.filter),
  //          JSON.parse(body.update),
  //        )
  //      res.status(HttpStatus.OK).json({
  //        success: true,
  //        message: `Updated Mechanics!`,
  //        data: updatedMechanics,
  //      })
  //    } catch (error) {
  //      res.status(HttpStatus.BAD_REQUEST).json({
  //        success: false,
  //        message: `Could not find the mechanics for given filters`,
  //        error: error,
  //      })
  //    }
  //  }

  @Delete('re-agent/:id')
  async deleteReAgentById(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params

    try {
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The request is invalid,\n please provide a valid request',
          error: new Error('Invalid Request Body'),
        })
      }
      const deletedAgent = await this.agentService.deleteREAgentById(id)
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Deleted real Estate Agent!`,
        data: deletedAgent,
      })
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          `An Unexpected Error Occured.\n Please try again after some time.`,
        error: error.name || 'Internal Server Error',
      })
    }
  }
}
