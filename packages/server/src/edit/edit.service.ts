import { Injectable } from '@nestjs/common';
import { PublishRequest } from '@kflow-struct/share';
import { TCurrentUser } from 'src/common/decorators/user-info.utils';
import { DataSource } from 'typeorm';
import { Component, ComponentData, Page } from './entities/edit.entity';

@Injectable()
export class EditService {

  constructor(
    private readonly dataSource: DataSource
  ) { }

  async publish(body: PublishRequest, user: TCurrentUser) {
    const { components, ...otherBody } = body;
    let pageId: number = -1; // Initialize with a default value

    // transaction
    const queryRunner = this.dataSource.createQueryRunner();

    // insert page components into component table
    const insertComponents = async (targetPageId: number) => {
      const newComponents: string[] = [];
      for (const component of components) {
        const componentResult = await queryRunner.manager.insert(Component, { 
          ...component, 
          options: component.options ?? {},
          page_id: targetPageId, 
          account_id: user.id 
        });
        newComponents.push(componentResult.identifiers[0].id);
      }

      // update page components
      await queryRunner.manager.update(Page, targetPageId, {
        components: newComponents
      });
      return newComponents;
    }


    const updatePage = async (page: Page) => {
      // Update page table, components set to empty array
      await queryRunner.manager.update(Page, page.id, { ...otherBody, components: [] });
      pageId = page.id;

      // Delete this user's components in component table
      for (const component of page.components) {
        await queryRunner.manager.delete(Component, component);
      }

      // delete component data in component_data table if has component data
      const componentData = await queryRunner.manager.findBy(ComponentData, { page_id: page.id });
      for (const data of componentData) {
        await queryRunner.manager.delete(ComponentData, data.id);
      }

      // insert new components
      await insertComponents(page.id);
    }

    const createPage = async () => {
      const page = await queryRunner.manager.insert(Page, { ...otherBody, account_id: user.id, components: [] });
      pageId = page.identifiers[0].id;
      await insertComponents(pageId);
    }

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 1. query page to check if exists
      const page = await queryRunner.manager.findOne(Page, { where: { account_id: user.id } });
      
      if (!page && !components?.length) {
        throw new Error('No components provided for new page');
      }

      // 2. if page exists, update it
      if (page) {
        await updatePage(page);

      } else {
        // 3. if page does not exist, create it
        await createPage();
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new Error('Publish failed: ' + error.message);
    } finally {
      await queryRunner.release();
    }

    if (pageId === -1) {
      throw new Error('Failed to determine page ID after publish operation');
    }
    
    return {
      code: 0,
      msg: 'Publish successfully!',
      data: pageId
    }
  }
}
