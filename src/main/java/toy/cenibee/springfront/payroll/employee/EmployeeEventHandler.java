package toy.cenibee.springfront.payroll.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.*;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import toy.cenibee.springfront.payroll.config.WebSocketConfiguration;
import toy.cenibee.springfront.payroll.manager.Manager;
import toy.cenibee.springfront.payroll.manager.ManagerRepository;

@Component
@RepositoryEventHandler
public class EmployeeEventHandler {

    private final SimpMessagingTemplate websocket;

    private final EntityLinks entityLinks;

    private final ManagerRepository managerRepository;

    @Autowired
    public EmployeeEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks,
            ManagerRepository managerRepository) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
        this.managerRepository = managerRepository;
    }

    @HandleAfterCreate
    public void newEmployee(Employee employee) {
        this.websocket.convertAndSend(WebSocketConfiguration.MESSAGE_PREFIX +
                "/newEmployee", getPath(employee));
    }

    @HandleAfterDelete
    public void deleteEmployee(Employee employee) {
        this.websocket.convertAndSend(WebSocketConfiguration.MESSAGE_PREFIX +
                "/deleteEmployee", getPath(employee));
    }

    @HandleAfterSave
    public void updateEmployee(Employee employee) {
        this.websocket.convertAndSend(WebSocketConfiguration.MESSAGE_PREFIX +
                "/updateEmployee", getPath(employee));
    }

    private String getPath(Employee employee) {
        return this.entityLinks.linkForItemResource(employee.getClass(),
                employee.getId()).toUri().getPath();
    }

    @HandleBeforeCreate
    @HandleBeforeSave
    public void applyUserInformationUsingSecurityContext(Employee employee) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Manager manager = this.managerRepository.findByName(name);
        if(manager == null) {
            Manager newManager = new Manager();
            newManager.setName(name);
            newManager.setRoles(new String[]{"ROLE_MANAGER"});
            manager = this.managerRepository.save(newManager);
        }
        employee.setManager(manager);
    }
}
